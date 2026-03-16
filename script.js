// ================== KONFIGURASI FIREBASE ==================
const firebaseConfig = {
  apiKey: "AIzaSyDn9ezWCPd35aHtPYqNWHAfnH15ggexaAg",
  authDomain: "monitoringpelindunggetah-32e80.firebaseapp.com",
  databaseURL: "https://monitoringpelindunggetah-32e80-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "monitoringpelindunggetah-32e80",
  storageBucket: "monitoringpelindunggetah-32e80.firebasestorage.app",
  messagingSenderId: "298224509643",
  appId: "1:298224509643:web:822cd45f170b05ca51b14e",
  measurementId: "G-Q02ZMSKCD7"
};

// ================== INIT FIREBASE ==================
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Reference Firebase
const sensorRef = db.ref("sensor");
const statusRef = db.ref("status");

// ================== DATA SENSOR ==================
sensorRef.on("value", (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  // -------- SENSOR HUJAN --------
  const hujanVal = data.hujan;
  document.getElementById("hujan").innerText = hujanVal;

  const hujanKet = document.getElementById("hujanKet");
  if (hujanVal < 1100) {
    hujanKet.innerText = "HUJAN";
    hujanKet.className = "keterangan ket-buruk";
  } else {
    hujanKet.innerText = "TIDAK HUJAN";
    hujanKet.className = "keterangan ket-bagus";
  }

  // -------- SENSOR LDR --------
  const ldrVal = data.ldr;
  document.getElementById("ldr").innerText = ldrVal;

  const ldrKet = document.getElementById("ldrKet");
  if (ldrVal < 900) {
    ldrKet.innerText = "GELAP";
    ldrKet.className = "keterangan ket-buruk";
  } else {
    ldrKet.innerText = "CERAH";
    ldrKet.className = "keterangan ket-bagus";
  }

  // -------- KELEMBAPAN UDARA --------
 // -------- KELEMBAPAN UDARA --------
const humVal = data.kelembapan;
document.getElementById("hum").innerText = humVal + " %";

const humKet = document.getElementById("humKet");

if (humVal >= 40 && humVal <= 70){

  humKet.innerText = "IDEAL";
  humKet.className = "keterangan ket-bagus";

}
else if (humVal > 70){

  humKet.innerText = "LEMBAB";
  humKet.className = "keterangan ket-buruk";

}
else{

  humKet.innerText = "KERING";
  humKet.className = "keterangan ket-bagus";

}
});

// ================== STATUS SISTEM ==================
statusRef.on("value", (snapshot) => {
  const status = snapshot.val();
  if (!status) return;

  // -------- SERVO / SISTEM --------
  const stateEl = document.getElementById("state");
  if (status.servo === 1) {
    stateEl.innerText = "BAGUS (Pelindung Terbuka)";
    stateEl.className = "value status-bagus";
  } else {
    stateEl.innerText = "BURUK (Pelindung Tertutup)";
    stateEl.className = "value status-buruk";
  }

  // -------- KONEKTIVITAS (OFFLINE/LIVE) --------
  const badge = document.getElementById("statusBadge");
  const text = document.getElementById("statusText");
  
  // Jika field 'connected' tidak ada, anggap Live (agar tidak membingungkan sebelum hardware diupdate)
  if (status.connected === false) {
    badge.classList.add("offline");
    text.innerText = "Offline";
  } else {
    badge.classList.remove("offline");
    text.innerText = "Live";
  }
});

// ================== THINGSPEAK INTEGRATION ==================
const TS_CHANNEL_ID = "3174391";
const TS_API_KEY = "Z654WHA08ZUGCM0L";
const TS_BASE_URL = `https://api.thingspeak.com/channels/${TS_CHANNEL_ID}/feeds.json?api_key=${TS_API_KEY}`;

let chartHujan, chartLdr, chartHum;
let refreshInterval;

// Helper to get Local Date as YYYY-MM-DD
function getLocalDateString() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().split('T')[0];
}

// Chart Options Builder
function getChartOptions(name, color) {
  return {
    chart: {
      type: 'area',
      height: 240,
      fontFamily: 'inherit',
      toolbar: { show: false },
      sparkline: { enabled: false },
      zoom: { enabled: false },
      selection: { enabled: false }
    },
    colors: [color],
    stroke: { curve: 'smooth', width: 2 },
    grid: { show: false },
    xaxis: {
      type: 'datetime',
      labels: { 
        show: true,
        style: { colors: '#86868b', fontSize: '10px' },
        datetimeUTC: false
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { 
      labels: { 
        show: true,
        style: { colors: '#86868b', fontSize: '10px' }
      } 
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0,
        stops: [0, 90]
      }
    },
    theme: { mode: 'dark' },
    tooltip: { x: { format: 'HH:mm' } },
    dataLabels: { enabled: false }
  };
}

// Initialize Charts
function initCharts() {
  chartHujan = new ApexCharts(document.querySelector("#chartHujan"), getChartOptions("Hujan", "#00b0ff"));
  chartLdr = new ApexCharts(document.querySelector("#chartLdr"), getChartOptions("Cahaya", "#ffab00"));
  chartHum = new ApexCharts(document.querySelector("#chartHum"), getChartOptions("Kelembapan", "#00e676"));

  chartHujan.render();
  chartLdr.render();
  chartHum.render();
}

// Fetch ThingSpeak Data
async function fetchThingSpeak(dateStr = null) {
  try {
    let url = TS_BASE_URL;
    const today = getLocalDateString();
    const isToday = !dateStr || dateStr === today;

    if (isToday) {
      url += `&results=80`; // Tampilkan data terbaru jika hari ini
    } else {
      url += `&start=${dateStr}%2000:00:00&end=${dateStr}%2023:59:59`;
    }

    const response = await fetch(url);
    const data = await response.json();
    const feeds = data.feeds || [];

    if (feeds.length === 0) {
      console.warn("No data for date:", dateStr);
      const emptySeries = [{ name: 'Data', data: [] }];
      chartHujan.updateSeries(emptySeries);
      chartLdr.updateSeries(emptySeries);
      chartHum.updateSeries(emptySeries);
      // alert("Tidak ada data pada tanggal yang dipilih.");
      return;
    }

    const dataHujan = feeds.map(f => ({ x: new Date(f.created_at).getTime(), y: parseFloat(f.field1) || 0 }));
    const dataLdr = feeds.map(f => ({ x: new Date(f.created_at).getTime(), y: parseFloat(f.field2) || 0 }));
    const dataHum = feeds.map(f => ({ x: new Date(f.created_at).getTime(), y: parseFloat(f.field3) || 0 }));

    chartHujan.updateSeries([{ name: 'Intensitas Hujan', data: dataHujan }]);
    chartLdr.updateSeries([{ name: 'Intensitas Cahaya', data: dataLdr }]);
    chartHum.updateSeries([{ name: 'Kelembapan', data: dataHum }]);

  } catch (error) {
    console.error("ThingSpeak Error:", error);
  }
}

// Handle Auto-Refresh
function startAutoRefresh() {
  if (refreshInterval) clearInterval(refreshInterval);
  refreshInterval = setInterval(() => {
    const selectedDate = document.getElementById("dateSelector").value;
    const today = getLocalDateString();
    if (selectedDate === today) {
      fetchThingSpeak(selectedDate);
    }
  }, 30000);
}

// Load UI and Startup Logic
document.addEventListener("DOMContentLoaded", () => {
  const dateSelector = document.getElementById("dateSelector");
  const refreshBtn = document.getElementById("refreshBtn");
  
  // Set default date to today
  const today = getLocalDateString();
  dateSelector.value = today;

  initCharts();
  fetchThingSpeak(today);
  startAutoRefresh();

  // Event Listeners
  dateSelector.addEventListener("change", (e) => {
    const selectedDate = e.target.value;
    fetchThingSpeak(selectedDate);
    
    // Disable interval if not today
    if (selectedDate !== today) {
      if (refreshInterval) clearInterval(refreshInterval);
    } else {
      startAutoRefresh();
    }
  });

  refreshBtn.addEventListener("click", () => {
    fetchThingSpeak(dateSelector.value);
  });
});