const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { verifyToken } = require('../middleware/auth.middleware');
const dbConfig = require('../config/db.config');

// Create MySQL pool
const pool = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get user's high score for Pacman
router.get('/pacman/highscore', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT MAX(score) as highScore FROM game_scores WHERE user_id = ? AND game_name = "pacman"',
      [req.userId]
    );
    
    res.json({ highScore: rows[0].highScore || 0 });
  } catch (error) {
    console.error('Error fetching high score:', error);
    res.status(500).json({ message: 'Error fetching high score' });
  }
});

// Save a new score for Pacman
router.post('/pacman/scores', verifyToken, async (req, res) => {
  const { score } = req.body;
  
  if (!score || typeof score !== 'number') {
    return res.status(400).json({ message: 'Invalid score' });
  }

  try {
    await pool.execute(
      'INSERT INTO game_scores (user_id, game_name, score, created_at) VALUES (?, "pacman", ?, NOW())',
      [req.userId, score]
    );
    
    res.json({ message: 'Score saved successfully' });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ message: 'Error saving score' });
  }
});

// Get Pacman leaderboard
router.get('/pacman/leaderboard', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT u.username, s.score, s.created_at
      FROM game_scores s
      JOIN users u ON s.user_id = u.id
      WHERE s.game_name = "pacman"
      ORDER BY s.score DESC
      LIMIT 10
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

module.exports = router;