document.addEventListener('DOMContentLoaded', () => {
  const entryForm = document.getElementById('entry-form');
  const entryLog = document.getElementById('entry-log');
  const weatherSelect = document.getElementById('entry-weather');
  const moodSelect = document.getElementById('entry-mood');
  const plantImg = document.getElementById('plant-stage');

  const currentUser = localStorage.getItem('currentUser');
  const entriesKey = `entries_${currentUser}`;
  const stageKey = `plant_stage_${currentUser}`;
  const dateKey = `plant_lastUpdate_${currentUser}`;
  const today = new Date().toISOString().split('T')[0];

  // 🌱 Grow plant once per day
  function updatePlantStageIfNewDay() {
    let currentStage = parseInt(localStorage.getItem(stageKey)) || 1;
    const lastUpdate = localStorage.getItem(dateKey);

    if (lastUpdate !== today && currentStage < 7) {
      currentStage++;
      localStorage.setItem(stageKey, currentStage);
      localStorage.setItem(dateKey, today);
    }

    const imgPath = `images/hibiscus${currentStage}.png`;
    plantImg.src = imgPath;
    plantImg.alt = `Hibiscus stage ${currentStage}`;
    plantImg.classList.add('grow');
    setTimeout(() => plantImg.classList.remove('grow'), 500);
  }

  // 🧠 Save entry
  entryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('entry-title').value.trim();
    const content = document.getElementById('entry-content').value.trim();
    const category = document.getElementById('entry-category').value.trim();
    const weather = weatherSelect.value;
    const mood = moodSelect.value;

    if (!title || !content || !category || !weather || !mood) return;

    const newEntry = { title, content, category, weather, mood, date: today };
    const entries = JSON.parse(localStorage.getItem(entriesKey)) || [];
    entries.push(newEntry);

    localStorage.setItem(entriesKey, JSON.stringify(entries));

    // 🎨 Theme
    document.body.className = `flower-bg dashboard weather-${weather}`;
    updatePlantStageIfNewDay();
    loadEntries();
    entryForm.reset();
  });

  // 🗑️ Delete entry with confirmation
  window.deleteEntry = function (index) {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    const entries = JSON.parse(localStorage.getItem(entriesKey)) || [];
    entries.splice(index, 1);
    localStorage.setItem(entriesKey, JSON.stringify(entries));
    loadEntries();
  };

  // 📜 Timeline View
  function loadEntries() {
    entryLog.innerHTML = '';
    const entries = JSON.parse(localStorage.getItem(entriesKey)) || [];

    const grouped = {};
    entries.forEach((entry, i) => {
      const dateKey = new Date(entry.date).toDateString();
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push({ ...entry, index: i });
    });

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
    sortedDates.forEach(date => {
      const dateGroup = document.createElement('li');
      dateGroup.innerHTML = `<h3>📅 ${date}</h3>`;
      grouped[date].forEach(entry => {
        const block = document.createElement('div');
        block.classList.add('entry-block');
        block.innerHTML = `
          <strong>📌 ${entry.title}</strong> (${entry.category})<br>
          ${entry.content}<br>
          Mood: ${entry.mood} | Weather: ${entry.weather}<br>
          <button class="delete-btn" onclick="deleteEntry(${entry.index})">🗑 Delete</button>
        `;
        dateGroup.appendChild(block);
      });
      entryLog.appendChild(dateGroup);
    });
  }

  // Init
  const savedEntries = JSON.parse(localStorage.getItem(entriesKey)) || [];
  if (savedEntries.length > 0) {
    const lastWeather = savedEntries[savedEntries.length - 1].weather;
    document.body.classList.add(`weather-${lastWeather}`);
  }

  updatePlantStageIfNewDay();
  loadEntries();
});
