document.addEventListener('DOMContentLoaded', () => {
  const entryForm = document.getElementById('entry-form');
  const entryLog = document.getElementById('entry-log');
  const weatherSelect = document.getElementById('entry-weather');
  const plantImg = document.getElementById('plant-stage');
  const streakEl = document.getElementById('streak-message');

  const currentUser = localStorage.getItem('currentUser');
  const entriesKey = `entries_${currentUser}`;
  const stageKey = `plant_stage_${currentUser}`;
  const dateKey = `plant_lastUpdate_${currentUser}`;
  const streakKey = `plant_streak_${currentUser}`;
  const lastVisitKey = `plant_lastVisit_${currentUser}`;

  function loadEntries() {
    entryLog.innerHTML = '';
    const entries = JSON.parse(localStorage.getItem(entriesKey)) || [];
    entries.forEach(entry => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${entry.title}</strong> (${entry.category})<br>${entry.content}`;
      entryLog.appendChild(li);
    });
  }

  function updatePlantStageIfNewDay() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    let currentStage = parseInt(localStorage.getItem(stageKey)) || 1;
    const lastUpdateDate = localStorage.getItem(dateKey);

    if (lastUpdateDate !== today && currentStage < 7) {
      currentStage += 1;
      localStorage.setItem(stageKey, currentStage);
      localStorage.setItem(dateKey, today);
    }

    const imgPath = `images/hibiscus${currentStage}.png`;
    plantImg.src = imgPath;
    plantImg.alt = `Hibiscus stage ${currentStage}`;
    plantImg.classList.add('grow');
    setTimeout(() => plantImg.classList.remove('grow'), 500);
  }

  function updateStreakCounter() {
    const today = new Date().toISOString().split('T')[0];
    let streak = parseInt(localStorage.getItem(streakKey)) || 0;
    const lastVisit = localStorage.getItem(lastVisitKey);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastVisit === today) {
      // already counted
    } else if (lastVisit === yesterdayStr) {
      streak += 1;
    } else {
      streak = 1;
    }

    localStorage.setItem(streakKey, streak);
    localStorage.setItem(lastVisitKey, today);

    if (streakEl) {
      streakEl.textContent = `You're on a ${streak}-day streak! 🌼`;
    }
  }

  entryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('entry-title').value.trim();
    const content = document.getElementById('entry-content').value.trim();
    const category = document.getElementById('entry-category').value.trim();
    const weather = weatherSelect.value;

    if (!title || !content || !category) return;

    const newEntry = { title, content, category, weather };
    const entries = JSON.parse(localStorage.getItem(entriesKey)) || [];
    entries.push(newEntry);
    localStorage.setItem(entriesKey, JSON.stringify(entries));

    document.body.classList.remove('weather-sunny', 'weather-cloudy', 'weather-rainy', 'weather-snowy', 'weather-windy');
    document.body.classList.add(`weather-${weather}`);

    updatePlantStageIfNewDay();
    updateStreakCounter();
    loadEntries();
    entryForm.reset();
  });

  // Initialize on page load
  loadEntries();
  updatePlantStageIfNewDay();
  updateStreakCounter();

  // Apply latest weather background if entry exists
  const pastEntries = JSON.parse(localStorage.getItem(entriesKey)) || [];
  if (pastEntries.length > 0) {
    const lastWeather = pastEntries[pastEntries.length - 1].weather;
    document.body.classList.add(`weather-${lastWeather}`);
  }
});
