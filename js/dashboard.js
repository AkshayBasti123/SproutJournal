
document.addEventListener('DOMContentLoaded', () => {
  const entryForm = document.getElementById('entry-form');
  const entryLog = document.getElementById('entry-log');
  const weatherSelect = document.getElementById('entry-weather');
  const plantImg = document.getElementById('plant-stage');

  const currentUser = localStorage.getItem('currentUser');
  const entriesKey = `entries_${currentUser}`;
  const stageKey = `plant_stage_${currentUser}`;
  const dateKey = `plant_lastUpdate_${currentUser}`;

  // 🌸 Load past entries
  function loadEntries() {
    entryLog.innerHTML = '';
    const entries = JSON.parse(localStorage.getItem(entriesKey)) || [];
    entries.forEach(entry => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${entry.title}</strong> (${entry.category})<br>${entry.content}`;
      entryLog.appendChild(li);
    });
  }

  // 🪴 Only grow plant once per calendar day
  function updatePlantStageIfNewDay() {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

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

  // 🌼 Save a new entry
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

    // 🌤️ Apply weather theme
    document.body.classList.remove('weather-sunny', 'weather-cloudy', 'weather-rainy', 'weather-snowy', 'weather-windy');
    document.body.classList.add(`weather-${weather}`);

    // 🪴 Check plant growth only if it’s a new day
    updatePlantStageIfNewDay();

    entryForm.reset();
    loadEntries();
  });

  // 🔄 Init
  loadEntries();

  // Set weather theme to last used one
  const savedEntries = JSON.parse(localStorage.getItem(entriesKey)) || [];
  if (savedEntries.length > 0) {
    const lastWeather = savedEntries[savedEntries.length - 1].weather;
    document.body.classList.add(`weather-${lastWeather}`);
  }

  updatePlantStageIfNewDay(); // Check on load
});
