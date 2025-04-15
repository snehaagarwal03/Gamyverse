/**
 * Games Module for Gamyverse
 * Handles game score management and dashboard updates using backend API
 */

// API base URL
const API_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
function getAuthToken() {
    return localStorage.getItem('token');
}

// Update high scores for the dashboard
async function updateHighScores() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !getAuthToken()) return;
    
    try {
        // Fetch user stats from backend API
        const response = await fetch(`${API_URL}/sessions/stats`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch user stats');
        }
        
        const data = await response.json();
        
        // Update high score displays on dashboard
        updateElementText('snake-highscore', data.bestScores.best_snake_score || '0');
        updateElementText('sudoku-besttime', formatTime(data.bestScores.best_sudoku_time) || '--:--');
        updateElementText('whackamole-highscore', data.bestScores.best_whackamole_score || '0');
        updateElementText('2048-highscore', data.bestScores.best_2048_score || '0');
        updateElementText('memorymatch-besttime', formatTime(data.bestScores.best_memorymatch_time) || '--:--');
        updateElementText('pacman-highscore', data.bestScores.best_pacman_score || '0');
        
        // Update total games count if element exists
        updateElementText('total-games', data.totalGames || '0');
    } catch (error) {
        console.error('Error updating high scores:', error);
    }
}

// Helper function to update text content of an element if it exists
function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

// Save high score for a game to backend
async function saveHighScore(game, score, isTime = false, extraData = {}) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !getAuthToken()) return false;
    
    try {
        // Prepare data to send
        let gameData = {};
        
        // For time-based games (formatted as MM:SS)
        if (isTime) {
            // Convert time to seconds if it's in MM:SS format
            const seconds = typeof score === 'string' ? timeToSeconds(score) : score;
            gameData.duration = seconds;
        } 
        // For point-based scores
        else {
            gameData.score = score;
        }
        
        // Add any extra data (like difficulty, moves, etc.)
        gameData = { ...gameData, ...extraData };
        
        // Map game name to appropriate endpoint
        let endpoint;
        switch (game) {
            case 'sudoku':
                endpoint = `${API_URL}/sessions/sudoku`;
                break;
            case 'snake':
                endpoint = `${API_URL}/sessions/snake`;
                break;
            case 'whackamole':
                endpoint = `${API_URL}/sessions/whackamole`;
                break;
            case '2048':
                endpoint = `${API_URL}/sessions/2048`;
                break;
            case 'memorymatch':
                endpoint = `${API_URL}/sessions/memorymatch`;
                break;
            case 'pacman':
                endpoint = `${API_URL}/sessions/pacman`;
                break;
            default:
                throw new Error('Invalid game specified');
        }
        
        // Send data to backend
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(gameData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save game session');
        }
        
        return true;
    } catch (error) {
        console.error(`Error saving ${game} score:`, error);
        return false;
    }
}

// Compare two time strings (format: MM:SS)
function compareTime(time1, time2) {
    // If either time is in '--:--' format, treat as infinity
    if (time1 === '--:--') return false;
    if (time2 === '--:--') return true;
    
    // Convert time strings to seconds
    const seconds1 = timeToSeconds(time1);
    const seconds2 = timeToSeconds(time2);
    
    // Lower time is better
    return seconds1 < seconds2;
}

// Convert time string (MM:SS) to seconds
function timeToSeconds(timeStr) {
    if (!timeStr || timeStr === '--:--') return Infinity;
    
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
}

// Format seconds to time string (MM:SS)
function formatTime(totalSeconds) {
    if (!totalSeconds || totalSeconds === null) return '--:--';
    
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}
