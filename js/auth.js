function signup() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const username = document.getElementById("username").value;

  if (!email || !pass || !username) return alert("Please fill all fields.");
  const userData = { email, password: pass, loginDates: [], entries: [] };
  localStorage.setItem(`user_${username}`, JSON.stringify(userData));
  localStorage.setItem("currentUser", username);
  window.location.href = "dashboard.html";
}

function login() {
  const username = document.getElementById("loginUsername").value;
  const pass = document.getElementById("loginPassword").value;

  const user = JSON.parse(localStorage.getItem(`user_${username}`));
  if (!user || user.password !== pass) {
    return alert("Invalid login.");
  }
  localStorage.setItem("currentUser", username);
  window.location.href = "dashboard.html";
}
