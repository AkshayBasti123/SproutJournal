const username = localStorage.getItem("currentUser");
if (!username) window.location.href = "index.html";

const today = new Date().toISOString().split("T")[0];
const userKey = `user_${username}`;
let userData = JSON.parse(localStorage.getItem(userKey)) || {
  entries: [],
  loginDates: [],
  streak: 0
};


function getYesterday(dateStr) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
}


function updateStreak() {
  const dates = [...new Set(userData.loginDates)].sort(); 
  let streak = 1;

  for (let i = dates.length - 2; i >= 0; i--) {
    const expected = getYesterday(dates[i + 1]);
    if (dates[i] === expected) {
      streak++;
    } else {
      break;
    }
  }

  const lastDate = dates[dates.length - 1];
  const missed = lastDate !== today && getYesterday(today) !== lastDate;

  userData.streak = missed ? 1 : streak;
}


function updatePlantVisual() {
  const stage = Math.min(userData.streak, 7);
  document.getElementById("plant-stage").src = `images/growth_stage_${stage}.png`;
}


function updateStreakAndPlant() {
  if (!userData.loginDates.includes(today)) {
    userData.loginDates.push(today);
  }

  updateStreak();
  updatePlantVisual();

  const todayEntry = userData.entries.find(e => e.date === today);
  if (todayEntry) {
    document.body.classList.add(`weather-${todayEntry.weather}`);
  }

  localStorage.setItem(userKey, JSON.stringify(userData));
}


function renderEntries() {
  const list = document.getElementById("entry-log");
  list.innerHTML = "";
  userData.entries
    .sort((a, b) => b.date.localeCompare(a.date))
    .forEach(entry => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${entry.title}</strong> (${entry.date})<br><em>${entry.category}</em> — ${entry.weather}<br>${entry.content}`;
      list.appendChild(li);
    });
}


document.getElementById("entry-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const entry = {
    title: document.getElementById("entry-title").value,
    content: document.getElementById("entry-content").value,
    category: document.getElementById("entry-category").value,
    weather: document.getElementById("entry-weather").value,
    date: today
  };


  userData.entries = userData.entries.filter(e => e.date !== today);
  userData.entries.push(entry);

  if (!userData.loginDates.includes(today)) {
    userData.loginDates.push(today);
  }

  updateStreakAndPlant();
  renderEntries();
  this.reset();
});

updateStreakAndPlant();
renderEntries();
