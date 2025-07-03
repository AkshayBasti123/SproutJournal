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

  function updatePlantStageIfNewDay() {
    let currentStage = parseInt(localStorage.getItem(stageKey)) || 1;
    const lastUpdate = localStorage.getItem(dateKey);

    if (lastUpdate !== today && currentStage < 7) {
      currentStage++;
      localStorage.setItem(stageKey, currentStage);
      localStorage.setItem(dateKey, today);
    }

    const affirmations = [
  "You’re blooming beautifully 🌼",
  "Every day is a new petal in your journey 🌸",
  "Keep growing, even on cloudy days ☁️",
  "You are rooted in strength and reaching for the sun ☀️",
  "One step, one leaf at a time 🍃"
];

const tips = [
  "Plants need sunlight, and so do you ☀️",
  "A little water each day goes a long way 💧",
  "Growth takes time, stay patient 🌱",
  "Even wilted leaves can bloom again 🌿",
  "Keep your roots strong and your petals proud 🌺"
];

const todayIndex = new Date().getDate() % affirmations.length;
document.getElementById("daily-affirmation").textContent = affirmations[todayIndex];
document.getElementById("daily-tip").textContent = tips[todayIndex];

// 🌱 Update stats
function updateStats() {
  const entries = JSON.parse(localStorage.getItem(entriesKey)) || [];
  const streak = parseInt(localStorage.getItem(`plant_stage_${currentUser}`)) || 1;
  document.getElementById("stat-streak").textContent = `Streak: ${streak} day${streak > 1 ? 's' : ''}`;
  document.getElementById("stat-entries").textContent = `Entries: ${entries.length}`;
}
    
    const imgPath = `images/hibiscus${currentStage}.png`;
    plantImg.src = imgPath;
    plantImg.alt = `Hibiscus stage ${currentStage}`;
    plantImg.classList.add('grow');
    setTimeout(() => plantImg.classList.remove('grow'), 500);
  }

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
    entries.push(newEntry);
    localStorage.setItem(entriesKey, JSON.stringify(entries));

    document.body.className = `flower-bg dashboard weather-${weather}`;
    updatePlantStageIfNewDay();
    triggerConfetti();
    entryForm.reset();
    loadEntries();
  });

  window.deleteEntry = function (index) {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    const entries = JSON.parse(localStorage.getItem(entriesKey)) || [];
    entries.splice(index, 1);
    localStorage.setItem(entriesKey, JSON.stringify(entries));
    loadEntries();
  };

  function loadEntries() {
    entryLog.innerHTML = '';
    const entries = JSON.parse(localStorage.getItem(entriesKey)) || [];

    const grouped = {};
    entries.forEach((entry, index) => {
      const parsedDate = new Date(Date.parse(entry.date));
  const dateKey = isNaN(parsedDate) ? 'Unknown Date' : parsedDate.toDateString();
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].unshift({ ...entry, index });
    });

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

  const savedEntries = JSON.parse(localStorage.getItem(entriesKey)) || [];
  if (savedEntries.length > 0) {
    const lastWeather = savedEntries[savedEntries.length - 1].weather;
    document.body.classList.add(`weather-${lastWeather}`);
  }

  updatePlantStageIfNewDay();
  loadEntries();
  updateStats()
});

function triggerConfetti() {
  const colors = ['#ff69b4', '#ffb6c1', '#ffd1dc', '#ffe4e1', '#ff1493'];
  const count = 150; // 🎉 Increase from 30 to 150

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.position = 'fixed';
    confetti.style.zIndex = 999;
    confetti.style.borderRadius = '50%';
    confetti.style.animation = `fall ${1 + Math.random()}s ease-out forwards`;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2000);
  }
}
