/**
 * Authentication Module for Gamyverse
 * Handles user registration, login, and session management using localStorage
 */

// Check if user is already logged in
function checkAuthStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // If on login or signup page but already logged in, redirect to dashboard
    if (currentUser && (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html'))) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // If on dashboard or game pages but not logged in, redirect to login
    if (!currentUser && (window.location.pathname.includes('dashboard.html') || 
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
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form inputs
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Validate inputs
        if (!username || !password) {
            showError('Please fill in all fields');
            return;
        }
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Find user with matching credentials
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Store current user in localStorage (without password)
            const currentUser = {
                username: user.username,
                email: user.email
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            showError('Invalid username or password');
        }
    });
}

// Handle signup form submission
if (document.getElementById('signup-form')) {
    document.getElementById('signup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form inputs
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
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
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if username already exists
        if (users.some(u => u.username === username)) {
            showError('Username already exists');
            return;
        }
        
        // Create new user
        const newUser = {
            username,
            email,
            password
        };
        
        // Add new user to users array
        users.push(newUser);
        
        // Update users in localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Store current user in localStorage (without password)
        const currentUser = {
            username,
            email
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    });
}

// Logout functionality
function logout() {
    // Remove current user from localStorage
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
