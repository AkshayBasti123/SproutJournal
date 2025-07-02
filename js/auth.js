function showLogin() {
  document.getElementById("signup").style.display = "none";
  document.getElementById("login").style.display = "block";
}

function showSignup() {
  document.getElementById("signup").style.display = "block";
  document.getElementById("login").style.display = "none";
}

function signup() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value.trim();

  if (!email || !password || !username) {
    return alert("All fields are required.");
  }

  if (localStorage.getItem(`user_${username}`)) {
    return alert("Username already exists.");
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
}

function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  const user = JSON.parse(localStorage.getItem(`user_${username}`));
  if (!user || user.password !== password) {
    return alert("Incorrect username or password.");
  }

  localStorage.setItem("currentUser", username);
  window.location.href = "dashboard.html";
}

import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔐 Signup
export function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// 🔐 Login
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
