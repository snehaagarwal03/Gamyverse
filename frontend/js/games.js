/**
 * Games Module for Gamyverse
 * Handles game score management and dashboard updates
 */

// Update high scores for the dashboard
function updateHighScores() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const username = currentUser.username;
    
    // Get high scores for each game from localStorage
    const snakeHighScore = localStorage.getItem(`snake_highscore_${username}`) || '0';
    const sudokuBestTime = localStorage.getItem(`sudoku_besttime_${username}`) || '--:--';
    const whackamoleHighScore = localStorage.getItem(`whackamole_highscore_${username}`) || '0';
    const game2048HighScore = localStorage.getItem(`2048_highscore_${username}`) || '0';
    const memorymatchBestTime = localStorage.getItem(`memorymatch_besttime_${username}`) || '--:--';
    const pacmanHighScore = localStorage.getItem(`pacman_highscore_${username}`) || '0';
    
    // Update high score displays on dashboard
    updateElementText('snake-highscore', snakeHighScore);
    updateElementText('sudoku-besttime', sudokuBestTime);
    updateElementText('whackamole-highscore', whackamoleHighScore);
    updateElementText('2048-highscore', game2048HighScore);
    updateElementText('memorymatch-besttime', memorymatchBestTime);
    updateElementText('pacman-highscore', pacmanHighScore);
}

// Helper function to update text content of an element if it exists
function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

// Save high score for a game
function saveHighScore(game, score, isTime = false) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return false;
    
    const username = currentUser.username;
    const scoreKey = `${game}_${isTime ? 'besttime' : 'highscore'}_${username}`;
    
    // For time-based scores (lower is better)
    if (isTime) {
        const currentBestTime = localStorage.getItem(scoreKey);
        
        // If no current best time or new time is better
        if (!currentBestTime || compareTime(score, currentBestTime)) {
            localStorage.setItem(scoreKey, score);
            return true;
        }
        return false;
    } 
    // For point-based scores (higher is better)
    else {
        const currentHighScore = parseInt(localStorage.getItem(scoreKey) || 0);
        
        // If new score is higher
        if (score > currentHighScore) {
            localStorage.setItem(scoreKey, score);
            return true;
        }
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
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
}

// Format seconds to time string (MM:SS)
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}
