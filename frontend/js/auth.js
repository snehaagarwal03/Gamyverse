window.API_URL = "http://localhost:5000/api";

function checkAuthStatus() {
  const token = localStorage.getItem("token");
  const currentUser = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser"))
    : null;

  if (
    token &&
    currentUser &&
    (window.location.pathname.includes("login.html") ||
      window.location.pathname.includes("signup.html"))
  ) {
    window.location.href = "dashboard.html";
    return;
  }

  if (
    (!token || !currentUser) &&
    (window.location.pathname.includes("dashboard.html") ||
      window.location.pathname.includes("/games/") ||
      window.location.pathname.includes("profile.html"))
  ) {
    window.location.href = window.location.pathname.includes("/games/")
      ? "../login.html"
      : "login.html";
    return;
  }

  if (currentUser) {
    const usernameDisplay = document.getElementById("username-display");
    if (usernameDisplay) {
      usernameDisplay.textContent = currentUser.username;
    }
  }
}

if (document.getElementById("login-form")) {
  document
    .getElementById("login-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;

      if (!username || !password) {
        showError("Please fill in all fields");
        return;
      }

      try {
        const response = await fetch(`${window.API_URL}/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
          })
        );

        window.location.href = "dashboard.html";
      } catch (error) {
        showError(error.message || "Login failed");
      }
    });
}

if (document.getElementById("signup-form")) {
  document
    .getElementById("signup-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      const gender = document.getElementById("gender")
        ? document.getElementById("gender").value
        : null;
      const age = document.getElementById("age")
        ? document.getElementById("age").value
        : null;

      if (!username || !email || !password || !confirmPassword) {
        showError("Please fill in all fields");
        return;
      }

      if (password !== confirmPassword) {
        showError("Passwords do not match");
        return;
      }

      if (password.length < 6) {
        showError("Password must be at least 6 characters long");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password, gender, age }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
          })
        );

        window.location.href = "dashboard.html";
      } catch (error) {
        showError(error.message || "Registration failed");
      }
    });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");

  if (window.location.pathname.includes("/games/")) {
    window.location.href = "../login.html";
  } else {
    window.location.href = "login.html";
  }
}

function showError(message) {
  const errorElement = document.getElementById("error-message");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";

    setTimeout(() => {
      errorElement.style.display = "none";
    }, 3000);
  }
}

function getAuthToken() {
  return localStorage.getItem("token");
}

document.addEventListener("DOMContentLoaded", function () {
  checkAuthStatus();

  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener("click", function (e) {
      e.preventDefault();
      dropdownMenu.classList.toggle("active");

      document.addEventListener("click", function closeDropdown(e) {
        if (
          !dropdownToggle.contains(e.target) &&
          !dropdownMenu.contains(e.target)
        ) {
          dropdownMenu.classList.remove("active");
          document.removeEventListener("click", closeDropdown);
        }
      });
    });
  }
});
