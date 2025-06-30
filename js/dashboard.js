document.addEventListener('DOMContentLoaded', () => {
  const entryForm = document.getElementById('entry-form');
  const entryLog = document.getElementById('entry-log');
  const weatherSelect = document.getElementById('entry-weather');
  const plantImg = document.getElementById('plant-stage');

  const currentUser = localStorage.getItem('currentUser');
  const entriesKey = `entries_${currentUser}`;

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

    // 🪴 Update plant stage
    updatePlantStage(entries.length);

    entryForm.reset();
    loadEntries();
  });

  // 🌱 Load plant based on number of entries (7 stages)
  function updatePlantStage(entryCount) {
    const stage = Math.min(entryCount, 7);
    const imgPath = `images/hibiscus${stage}.png`; // ✅ using your filenames
    plantImg.src = imgPath;
    plantImg.alt = `Hibiscus stage ${stage}`;
    plantImg.classList.add('grow');
    setTimeout(() => plantImg.classList.remove('grow'), 500);
  }

  // 🔄 Init
  loadEntries();
  const savedEntries = JSON.parse(localStorage.getItem(entriesKey)) || [];

  // Set initial weather theme based on last entry (optional)
  if (savedEntries.length > 0) {
    const lastWeather = savedEntries[savedEntries.length - 1].weather;
    document.body.classList.add(`weather-${lastWeather}`);
  }

  updatePlantStage(savedEntries.length);
});
