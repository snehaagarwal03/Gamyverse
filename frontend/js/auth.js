/**
 * Authentication Module for Gamyverse
 * Handles user registration, login, and session management using JWT tokens and backend API
 */

// API base URL
const API_URL = 'http://localhost:5000/api';

// Check if user is already logged in
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;
    
    // If on login or signup page but already logged in, redirect to dashboard
    if (token && currentUser && (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html'))) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // If on dashboard or game pages but not logged in, redirect to login
    if ((!token || !currentUser) && (window.location.pathname.includes('dashboard.html') || 
                          window.location.pathname.includes('/games/') ||
                          window.location.pathname.includes('profile.html'))) {
        window.location.href = window.location.pathname.includes('/games/') ? '../login.html' : 'login.html';
        return;
    }
    
    // Update username display if user is logged in
    if (currentUser) {
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = currentUser.username;
        }
    }
}

// Handle login form submission
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form inputs
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Validate inputs
        if (!username || !password) {
            showError('Please fill in all fields');
            return;
        }
        
        try {
            // Send login request to API
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            // Store token and user info in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify({
                id: data.user.id,
                username: data.user.username,
                email: data.user.email
            }));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } catch (error) {
            showError(error.message || 'Login failed');
        }
    });
}

// Handle signup form submission
if (document.getElementById('signup-form')) {
    document.getElementById('signup-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form inputs
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const gender = document.getElementById('gender') ? document.getElementById('gender').value : null;
        const age = document.getElementById('age') ? document.getElementById('age').value : null;
        
        // Validate inputs
        if (!username || !email || !password || !confirmPassword) {
            showError('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            return;
        }
        
        try {
            // Send registration request to API
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, gender, age })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            
            // Store token and user info in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify({
                id: data.user.id,
                username: data.user.username,
                email: data.user.email
            }));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } catch (error) {
            showError(error.message || 'Registration failed');
        }
    });
}

// Logout functionality
function logout() {
    // Remove token and user from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    
    // Redirect to login page
    if (window.location.pathname.includes('/games/')) {
        window.location.href = '../login.html';
    } else {
        window.location.href = 'login.html';
    }
}

// Display error message
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Hide error after 3 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
});
