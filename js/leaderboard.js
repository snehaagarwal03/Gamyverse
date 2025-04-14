/**
 * Leaderboard Module for Gamyverse
 * Handles game leaderboards using localStorage
 */

// Add a score to the leaderboard
function addToLeaderboard(game, score, difficulty = 'normal') {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get current leaderboard from localStorage
    const leaderboardKey = `leaderboard_${game}`;
    const leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    
    // Create entry
    const entry = {
        username: currentUser.username,
        score: score,
        difficulty: difficulty,
        timestamp: Date.now()
    };
    
    // Check if user already has an entry
    const existingEntryIndex = leaderboard.findIndex(item => item.username === currentUser.username);
    
    // For time-based games (lower is better)
    if (game === 'sudoku' || game === 'memorymatch') {
        // Format score as time if it's a number (assuming it's seconds)
        if (typeof score === 'number') {
            entry.displayScore = formatTime(score);
        } else {
            entry.displayScore = score;
        }
        
        // If user already has an entry, update only if new score is better
        if (existingEntryIndex !== -1) {
            const existingScore = leaderboard[existingEntryIndex].score;
            if (score < existingScore) {
                leaderboard[existingEntryIndex] = entry;
            }
        } else {
            leaderboard.push(entry);
        }
        
        // Sort by score (ascending for time - lower is better)
        leaderboard.sort((a, b) => a.score - b.score);
    } 
    // For point-based games (higher is better)
    else {
        // If user already has an entry, update only if new score is better
        if (existingEntryIndex !== -1) {
            const existingScore = leaderboard[existingEntryIndex].score;
            if (score > existingScore) {
                leaderboard[existingEntryIndex] = entry;
            }
        } else {
            leaderboard.push(entry);
        }
        
        // Sort by score (descending for points - higher is better)
        leaderboard.sort((a, b) => b.score - a.score);
    }
    
    // Keep only top 10 scores
    const topScores = leaderboard.slice(0, 10);
    
    // Save to localStorage
    localStorage.setItem(leaderboardKey, JSON.stringify(topScores));
}

// Display leaderboard
function displayLeaderboard(game) {
    const leaderboardBody = document.getElementById('leaderboard-body');
    if (!leaderboardBody) return;
    
    // Clear existing entries
    leaderboardBody.innerHTML = '';
    
    // Get leaderboard from localStorage
    const leaderboardKey = `leaderboard_${game}`;
    const leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    
    // If leaderboard is empty
    if (leaderboard.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="4">No scores yet. Be the first to set a record!</td>`;
        leaderboardBody.appendChild(emptyRow);
        return;
    }
    
    // Create rows for each entry
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        
        // Determine what to display as score
        let displayScore = entry.displayScore || entry.score;
        
        // Create row cells based on game type
        if (game === 'sudoku' || game === 'memorymatch') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.username}</td>
                <td>${displayScore}</td>
                <td>${entry.difficulty || 'normal'}</td>
            `;
        } else {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.username}</td>
                <td>${displayScore}</td>
                ${entry.difficulty ? `<td>${entry.difficulty}</td>` : ''}
            `;
        }
        
        // Highlight current user's score
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && entry.username === currentUser.username) {
            row.style.backgroundColor = 'rgba(0, 255, 204, 0.1)';
        }
        
        leaderboardBody.appendChild(row);
    });
}

// Format seconds to time string (MM:SS)
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}
