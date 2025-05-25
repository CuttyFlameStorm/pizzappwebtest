// connexion.js

// Identifiants en dur
const ADMIN_EMAIL = "sidath@pizza.io";
const ADMIN_PASSWORD = "afpa123456789";

const loginForm = document.getElementById("loginForm");
const inputEmail = document.getElementById("identifiant");
const inputPassword = document.getElementById("motdepasse");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = inputEmail.value.trim();
  const password = inputPassword.value.trim();

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    sessionStorage.setItem("auth", "autorisation accordé");
    window.location.href = "admin.html";
  } else {
    alert("Identifiant ou mot de passe incorrect.");
  }
});
