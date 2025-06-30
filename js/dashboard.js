const username = localStorage.getItem("currentUser");
if (!username) window.location.href = "index.html";

const today = new Date().toISOString().split("T")[0];
const userKey = `user_${username}`;
let userData = JSON.parse(localStorage.getItem(userKey)) || {};

function updateStreakAndPlant() {
  if (!userData.loginDates.includes(today)) {
    userData.loginDates.push(today);
  }
  const streak = userData.loginDates.length;
  const stage = Math.min(streak, 7);
  document.getElementById("plant-stage").src = `images/growth_stage_${stage}.png`;

  // Set weather background if available
  const todayEntry = userData.entries.find(e => e.date === today);
  if (todayEntry) {
    document.body.className = `weather-${todayEntry.weather}`;
  }

  localStorage.setItem(userKey, JSON.stringify(userData));
}
updateStreakAndPlant();

document.getElementById("entry-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const entry = {
    title: document.getElementById("entry-title").value,
    content: document.getElementById("entry-content").value,
    category: document.getElementById("entry-category").value,
    weather: document.getElementById("entry-weather").value,
    date: today
  };
  userData.entries.push(entry);
  localStorage.setItem(userKey, JSON.stringify(userData));
  updateStreakAndPlant();
  renderEntries();
  this.reset();
});

function renderEntries() {
  const list = document.getElementById("entry-log");
  list.innerHTML = "";
  userData.entries.sort((a, b) => b.date.localeCompare(a.date));
  userData.entries.forEach(entry => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${entry.title}</strong> (${entry.date})<br>
                    <em>${entry.category}</em> — ${entry.weather}<br>
                    ${entry.content}`;
    list.appendChild(li);
  });
}
renderEntries();
