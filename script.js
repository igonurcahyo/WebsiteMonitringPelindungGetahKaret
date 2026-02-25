<<<<<<< HEAD
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
  const humVal = data.kelembapan;
  document.getElementById("hum").innerText = humVal + " %";

  const humKet = document.getElementById("humKet");
  if (humVal < 60) {
    humKet.innerText = "IDEAL";
    humKet.className = "keterangan ket-bagus";
  } else {
    humKet.innerText = "LEMBAB";
    humKet.className = "keterangan ket-buruk";
  }
});

// ================== STATUS SISTEM ==================
statusRef.on("value", (snapshot) => {
  const status = snapshot.val();
  if (!status) return;

  const stateEl = document.getElementById("state");

  if (status.servo === 1) {
    stateEl.innerText = "BAGUS (Pelindung Terbuka)";
    stateEl.className = "value status-bagus";
  } else {
    stateEl.innerText = "BURUK (Pelindung Tertutup)";
    stateEl.className = "value status-buruk";
  }
=======
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
  const humVal = data.kelembapan;
  document.getElementById("hum").innerText = humVal + " %";

  const humKet = document.getElementById("humKet");
  if (humVal < 60) {
    humKet.innerText = "IDEAL";
    humKet.className = "keterangan ket-bagus";
  } else {
    humKet.innerText = "LEMBAB";
    humKet.className = "keterangan ket-buruk";
  }
});

// ================== STATUS SISTEM ==================
statusRef.on("value", (snapshot) => {
  const status = snapshot.val();
  if (!status) return;

  const stateEl = document.getElementById("state");

  if (status.servo === 1) {
    stateEl.innerText = "BAGUS (Pelindung Terbuka)";
    stateEl.className = "value status-bagus";
  } else {
    stateEl.innerText = "BURUK (Pelindung Tertutup)";
    stateEl.className = "value status-buruk";
  }
>>>>>>> 8769cc3 (p)
});