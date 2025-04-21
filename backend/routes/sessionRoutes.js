const express = require("express");
const router = express.Router();
const {
  insertSudokuSession,
  insertSnakeGameSession,
  insertWhackAMoleSession,
  insert2048Session,
  insertMemoryMatchSession,
  getLeaderboard,
  getUserStats,
} = require("../controllers/sessionController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/sudoku", insertSudokuSession);
router.post("/snake", insertSnakeGameSession);
router.post("/whackamole", insertWhackAMoleSession);
router.post("/2048", insert2048Session);
router.post("/memorymatch", insertMemoryMatchSession);

router.get("/leaderboard/:game", getLeaderboard);

router.get("/stats", getUserStats);

module.exports = router;
