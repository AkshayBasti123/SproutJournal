import { database } from './firebase.js';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const output = document.getElementById('output');

onValue(ref(database, 'users'), snapshot => {
  const data = snapshot.val();
  output.textContent = JSON.stringify(data, null, 2);
});
