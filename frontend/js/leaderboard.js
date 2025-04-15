/**
 * Leaderboard Module for Gamyverse
 * Handles game leaderboards using backend API
 */

// API base URL
const API_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
function getAuthToken() {
    return localStorage.getItem('token');
}

// No need to explicitly add to leaderboard anymore as this is handled by saveHighScore in games.js
// This function is kept for backwards compatibility but modified to work with API
async function addToLeaderboard(game, score, difficulty = 'normal') {
    // Just forward to saveHighScore in games.js, assuming it's available
    if (typeof saveHighScore === 'function') {
        const extraData = { difficultyLevel: difficulty };
        
        // For time-based games (formatted as MM:SS)
        if (game === 'sudoku' || game === 'memorymatch') {
            // Call with isTime=true
            await saveHighScore(game, score, true, extraData);
        } else {
            // Call with isTime=false
            await saveHighScore(game, score, false, extraData);
        }
    } else {
        console.error('saveHighScore function not found');
    }
}

// Display leaderboard fetched from backend API
async function displayLeaderboard(game) {
    const leaderboardBody = document.getElementById('leaderboard-body');
    if (!leaderboardBody) return;
    
    // Clear existing entries
    leaderboardBody.innerHTML = '';
    
    try {
        // Fetch leaderboard from backend API
        const response = await fetch(`${API_URL}/sessions/leaderboard/${game}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard');
        }
        
        const leaderboard = await response.json();
        
        // If leaderboard is empty
        if (leaderboard.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="4">No scores yet. Be the first to set a record!</td>`;
            leaderboardBody.appendChild(emptyRow);
            return;
        }
        
        // Get current user for highlighting
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // Create rows for each entry
        leaderboard.forEach((entry, index) => {
            const row = document.createElement('tr');
            
            // Determine what to display as score
            let displayScore = entry.Score;
            
            // Format time-based scores (sudoku, memorymatch)
            if (game === 'sudoku' || game === 'memorymatch') {
                displayScore = formatTime(displayScore);
                
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${entry.Username}</td>
                    <td>${displayScore}</td>
                    <td>${entry.Difficulty || 'normal'}</td>
                `;
            } else {
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${entry.Username}</td>
                    <td>${displayScore}</td>
                    ${entry.Difficulty ? `<td>${entry.Difficulty}</td>` : ''}
                `;
            }
            
            // Highlight current user's score
            if (currentUser && entry.Username === currentUser.username) {
                row.style.backgroundColor = 'rgba(0, 255, 204, 0.1)';
            }
            
            leaderboardBody.appendChild(row);
        });
    } catch (error) {
        console.error(`Error fetching ${game} leaderboard:`, error);
        // Display error message in leaderboard
        const errorRow = document.createElement('tr');
        errorRow.innerHTML = `<td colspan="4">Error loading leaderboard. Please try again later.</td>`;
        leaderboardBody.appendChild(errorRow);
    }
}

// Format seconds to time string (MM:SS)
function formatTime(totalSeconds) {
    if (!totalSeconds || totalSeconds === null) return '--:--';
    
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}
