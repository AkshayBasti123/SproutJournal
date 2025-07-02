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

  // 🌱 Update Plant Growth
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

    const newEntry = {
      title,
      content,
      category,
      weather,
      mood,
      date: new Date().toISOString()
    };

    const entries = JSON.parse(localStorage.getItem(entriesKey)) || [];
    entries.push(newEntry); // ✅ DON'T REPLACE — JUST ADD

    localStorage.setItem(entriesKey, JSON.stringify(entries));

    document.body.className = `flower-bg dashboard weather-${weather}`;
    updatePlantStageIfNewDay();
    entryForm.reset();
    loadEntries();
  });

  // 🗑️ Delete
  window.deleteEntry = function (index) {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    const entries = JSON.parse(localStorage.getItem(entriesKey)) || [];
    entries.splice(index, 1);
    localStorage.setItem(entriesKey, JSON.stringify(entries));
    loadEntries();
  };

  // 📜 Load Timeline Entries
  function loadEntries() {
    entryLog.innerHTML = '';
    const entries = JSON.parse(localStorage.getItem(entriesKey)) || [];

    // Group by date (day precision)
    const grouped = {};
    entries.forEach((entry, index) => {
      const dateKey = new Date(entry.date).toDateString();
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push({ ...entry, index });
    });

    // Sort date groups (newest first)
    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

    sortedDates.forEach(date => {
      const groupContainer = document.createElement('li');
      groupContainer.innerHTML = `<h3>📅 ${date}</h3>`;

      grouped[date].forEach(entry => {
        const block = document.createElement('div');
        block.classList.add('entry-block');
        block.innerHTML = `
          <strong>📌 ${entry.title}</strong> (${entry.category})<br>
          ${entry.content}<br>
          Mood: ${entry.mood} | Weather: ${entry.weather}<br>
          <small>${new Date(entry.date).toLocaleTimeString()}</small><br>
          <button class="delete-btn" onclick="deleteEntry(${entry.index})">🗑 Delete</button>
        `;
        groupContainer.appendChild(block);
      });

      entryLog.appendChild(groupContainer);
    });
  }

  // Init on page load
  const savedEntries = JSON.parse(localStorage.getItem(entriesKey)) || [];
  if (savedEntries.length > 0) {
    const lastWeather = savedEntries[savedEntries.length - 1].weather;
    document.body.classList.add(`weather-${lastWeather}`);
  }

  updatePlantStageIfNewDay();
  loadEntries();
});
