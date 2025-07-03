// Show Login Form
window.showLogin = function () {
  document.getElementById("signup").style.display = "none";
  document.getElementById("login").style.display = "block";
  document.getElementById("reset").style.display = "none";
};

window.showSignup = function () {
  document.getElementById("signup").style.display = "block";
  document.getElementById("login").style.display = "none";
  document.getElementById("reset").style.display = "none";
};

window.showReset = function () {
  document.getElementById("signup").style.display = "none";
  document.getElementById("login").style.display = "none";
  document.getElementById("reset").style.display = "block";
};

// Signup Logic
window.signup = function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value.trim().toLowerCase();

  if (!email || !password || !username) {
    alert("All fields are required.");
    return;
  }

  if (localStorage.getItem(`user_${username}`)) {
    alert("Username already exists.");
    return;
  }

  const userData = {
    email,
    password,
    loginDates: [],
    entries: []
  };

  localStorage.setItem(`user_${username}`, JSON.stringify(userData));
  localStorage.setItem("currentUser", username);
  window.location.href = "dashboard.html";
};

// Login Logic
window.login = function () {
  const username = document.getElementById("loginUsername").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  const user = JSON.parse(localStorage.getItem(`user_${username}`));
  if (!user || user.password !== password) {
    alert("Incorrect username or password.");
    return;
  }

  localStorage.setItem("currentUser", username);
  window.location.href = "dashboard.html";
};

window.resetPassword = function () {
  const username = document.getElementById("resetUsername").value.trim().toLowerCase();
  const email = document.getElementById("resetEmail").value.trim();
  const newPassword = document.getElementById("newPassword").value;

  const userKey = `user_${username}`;
  const user = JSON.parse(localStorage.getItem(userKey));

  if (!user || user.email !== email) {
    alert("Username and email do not match.");
    return;
  }

  user.password = newPassword;
  localStorage.setItem(userKey, JSON.stringify(user));
  alert("Password reset successful! You can now log in.");
  window.showLogin();
};
