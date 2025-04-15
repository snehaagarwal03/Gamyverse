const express = require('express');
const router = express.Router();
const { 
  insertSudokuSession, 
  insertSnakeGameSession, 
  insertWhackAMoleSession, 
  insert2048Session, 
  insertMemoryMatchSession,
  getLeaderboard,
  getUserStats
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Insert session data routes
router.post('/sudoku', insertSudokuSession);
router.post('/snake', insertSnakeGameSession);
router.post('/whackamole', insertWhackAMoleSession);
router.post('/2048', insert2048Session);
router.post('/memorymatch', insertMemoryMatchSession);

// Get leaderboard data
router.get('/leaderboard/:game', getLeaderboard);

// Get user stats
router.get('/stats', getUserStats);

module.exports = router;
