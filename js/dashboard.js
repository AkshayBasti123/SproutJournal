import { auth, database } from './firebase.js';
import { ref, push, onValue, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
  const entryForm = document.getElementById('entry-form');
  const entryLog = document.getElementById('entry-log');
  const weatherSelect = document.getElementById('entry-weather');
  const plantImg = document.getElementById('plant-stage');
  const streakEl = document.getElementById('streak-message');

  auth.onAuthStateChanged(user => {
    if (!user) return window.location.href = 'index.html';

    const uid = user.uid;
    const userRef = ref(database, 'users/' + uid);

    loadEntries();
    updatePlantStageIfNewDay();
    updateStreakCounter();

    entryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('entry-title').value;
      const content = document.getElementById('entry-content').value;
      const category = document.getElementById('entry-category').value;
      const weather = weatherSelect.value;

      const newEntry = {
        title,
        content,
        category,
        weather,
        timestamp: Date.now()
      };

      push(ref(database, `users/${uid}/entries`), newEntry).then(() => {
        entryForm.reset();
        loadEntries();
        applyWeatherTheme(weather);
        updatePlantStageIfNewDay();
        updateStreakCounter();
      });
    });

    function loadEntries() {
      onValue(ref(database, `users/${uid}/entries`), snapshot => {
        entryLog.innerHTML = '';
        const entries = snapshot.val();
        if (entries) {
          Object.values(entries).forEach(entry => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${entry.title}</strong> (${entry.category})<br>${entry.content}`;
            entryLog.appendChild(li);
          });
        }
      });
    }

    function applyWeatherTheme(weather) {
      document.body.classList.remove('weather-sunny', 'weather-cloudy', 'weather-rainy', 'weather-snowy', 'weather-windy');
      document.body.classList.add(`weather-${weather}`);
    }

    function updatePlantStageIfNewDay() {
      const today = new Date().toISOString().split('T')[0];
      const stageRef = ref(database, `users/${uid}/plant`);
      get(stageRef).then(snapshot => {
        let data = snapshot.val() || { stage: 1, lastUpdate: '' };
        if (data.lastUpdate !== today && data.stage < 7) {
          data.stage += 1;
          data.lastUpdate = today;
          set(stageRef, data);
        }
        plantImg.src = `images/hibiscus${data.stage}.png`;
        plantImg.alt = `Hibiscus stage ${data.stage}`;
      });
    }

    function updateStreakCounter() {
      const today = new Date().toISOString().split('T')[0];
      const streakRef = ref(database, `users/${uid}/streak`);
      get(streakRef).then(snapshot => {
        let data = snapshot.val() || { count: 0, lastVisit: '' };
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (data.lastVisit === today) {
          // do nothing
        } else if (data.lastVisit === yesterdayStr) {
          data.count += 1;
        } else {
          data.count = 1;
        }

        data.lastVisit = today;
        set(streakRef, data);
        if (streakEl) {
          streakEl.textContent = `You're on a ${data.count}-day streak! 🌼`;
        }
      });
    }
  });
});
