// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUddqtOcVPHVMB-S8V5UX1kWIG3VfonoQ",
  authDomain: "flowebloom-68d56.firebaseapp.com",
  projectId: "flowebloom-68d56",
  storageBucket: "flowebloom-68d56.firebasestorage.app",
  messagingSenderId: "993963366912",
  appId: "1:993963366912:web:708e5e8fd90ccba359d6e5",
  measurementId: "G-KZTNRG4X3N"
};

const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
