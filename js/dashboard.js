document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("currentUser");
  if (!username) {
    window.location.href = "index.html";
    return;
  }

  const userData = JSON.parse(localStorage.getItem(`user_${username}`));
  const streakDisplay = document.createElement("h4");
  document.querySelector(".dashboard-container").prepend(streakDisplay);

  updateStreak(userData, username, streakDisplay);
  updatePlantImage(userData.loginDates);

  renderEntries(userData.entries);

  document.getElementById("entry-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("entry-title").value.trim();
    const content = document.getElementById("entry-content").value.trim();
    const category = document.getElementById("entry-category").value.trim();
    const weather = document.getElementById("entry-weather").value;

    if (!title || !content || !category || !weather) {
      alert("Please fill in all fields.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const alreadyLoggedToday = userData.loginDates.includes(today);

    const newEntry = {
      title,
      content,
      category,
      weather,
      date: new Date().toISOString()
    };

    userData.entries.push(newEntry);

    if (!alreadyLoggedToday) {
      userData.loginDates.push(today);
    }

    localStorage.setItem(`user_${username}`, JSON.stringify(userData));

    applyWeatherTheme(weather);
    updateStreak(userData, username, streakDisplay);
    updatePlantImage(userData.loginDates);
    renderEntries(userData.entries);

    // Clear form
    document.getElementById("entry-form").reset();
  });
});

function updatePlantImage(loginDates) {
  const uniqueDays = new Set(loginDates.map(d => d)).size;
  const cappedDay = Math.min(uniqueDays, 7);
  const plantImage = document.getElementById("plant-stage");
  plantImage.src = `images/hibiscus${cappedDay}.png`;
  plantImage.alt = `Hibiscus Stage ${cappedDay}`;
}

function updateStreak(userData, username, streakDisplay) {
  const sortedDates = [...new Set(userData.loginDates)].sort();
  let streak = 0;
  let prev = null;

  sortedDates.forEach(dateStr => {
    const date = new Date(dateStr);
    if (!prev) {
      streak = 1;
    } else {
      const diff = (date - prev) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
      } else if (diff > 1) {
        streak = 1;
      }
    }
    prev = new Date(dateStr);
  });

  streakDisplay.textContent = `🌟 Streak: ${streak} day${streak !== 1 ? 's' : ''}`;
}

function renderEntries(entries) {
  const list = document.getElementById("entry-log");
  list.innerHTML = "";

  entries.forEach((entry, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h4>${entry.title}</h4>
      <p><strong>Category:</strong> ${entry.category}</p>
      <p><strong>Weather:</strong> ${entry.weather}</p>
      <p>${entry.content}</p>
      <small>${new Date(entry.date).toLocaleString()}</small>
      <br />
      <button class="delete-btn" onclick="deleteEntry(${index})">🗑️ Delete</button>
    `;
    list.appendChild(li);
  });
}

function deleteEntry(index) {
  if (!confirm("Are you sure you want to delete this entry?")) return;

  const username = localStorage.getItem("currentUser");
  const userData = JSON.parse(localStorage.getItem(`user_${username}`));

  userData.entries.splice(index, 1);
  localStorage.setItem(`user_${username}`, JSON.stringify(userData));

  renderEntries(userData.entries);
}

function applyWeatherTheme(weather) {
  const body = document.body;
  body.classList.remove(
    "weather-sunny",
    "weather-cloudy",
    "weather-rainy",
    "weather-snowy",
    "weather-windy"
  );
  body.classList.add(`weather-${weather}`);
}

window.deleteEntry = deleteEntry;
