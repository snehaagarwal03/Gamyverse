const { pool } = require("../db");

// Generic function to insert session data for any game
const insertGameSession = async (req, res, tableName, fields) => {
  try {
    const userId = req.user.id;

    // Build the SQL query dynamically based on provided fields
    let columns = ["User_Id"];
    let placeholders = ["?"];
    let values = [userId];

    // Add additional fields from request body
    Object.keys(fields).forEach((field) => {
      if (req.body[field] !== undefined) {
        columns.push(fields[field]);
        placeholders.push("?");
        values.push(req.body[field]);
      }
    });

    // Build and execute the query
    const query = `INSERT INTO ${tableName} (${columns.join(
      ", "
    )}) VALUES (${placeholders.join(", ")})`;
    const [result] = await pool.execute(query, values);

    res.status(201).json({
      message: "Game session recorded successfully",
      sessionId: result.insertId,
    });
  } catch (error) {
    console.error(`Error inserting ${tableName} session:`, error);
    res.status(500).json({ message: "Server error" });
  }
};

// Insert Sudoku session
exports.insertSudokuSession = async (req, res) => {
  const fields = {
    duration: "Duration",
    difficultyLevel: "Difficulty_Level",
  };
  return insertGameSession(req, res, "Sudoku_Sessions", fields);
};

// Insert Snake Game session
exports.insertSnakeGameSession = async (req, res) => {
  const fields = {
    score: "Score",
  };
  return insertGameSession(req, res, "SnakeGame_Sessions", fields);
};

// Insert Whack A Mole session
exports.insertWhackAMoleSession = async (req, res) => {
  const fields = {
    score: "Score",
    molesWhacked: "Moles_Whacked",
    difficultyLevel: "Difficulty_Level",
  };
  return insertGameSession(req, res, "WhackAMole_Sessions", fields);
};

// Insert 2048 session
exports.insert2048Session = async (req, res) => {
  const fields = {
    score: "Score",
  };
  return insertGameSession(req, res, "2048_Sessions", fields);
};

// Insert Memory Match session
exports.insertMemoryMatchSession = async (req, res) => {
  const fields = {
    score: "Score",
    duration: "Duration",
    moves: "Moves",
    difficultyLevel: "Difficulty_Level",
  };
  return insertGameSession(req, res, "MemoryMatch_Sessions", fields);
};

// Get leaderboard for a specific game
exports.getLeaderboard = async (req, res) => {
  try {
    const { game } = req.params;

    let query,
      params = [];

    // Determine which game's leaderboard to fetch
    switch (game.toLowerCase()) {
      case "sudoku":
        // For Sudoku, the lowest duration is best (ascending order)
        // Also sort by difficulty level when durations are equal (hard > medium > easy)
        query = `
          SELECT u.Username, s.Duration as Score, s.Difficulty_Level as Difficulty
          FROM Sudoku_Sessions s
          JOIN Users u ON s.User_Id = u.User_Id
          WHERE (s.User_Id, s.Duration) IN (
            SELECT User_Id, MIN(Duration) as MinDuration
            FROM Sudoku_Sessions
            GROUP BY User_Id
          )
          ORDER BY s.Duration ASC, 
            CASE 
              WHEN s.Difficulty_Level = 'hard' THEN 1
              WHEN s.Difficulty_Level = 'medium' THEN 2
              WHEN s.Difficulty_Level = 'easy' THEN 3
              ELSE 4
            END ASC
          LIMIT 5
        `;
        break;

      case "snake":
        // For Snake game, the highest score is best (descending order)
        query = `
        SELECT u.Username, MAX(s.Score) as Score
    FROM SnakeGame_Sessions s
    JOIN Users u ON s.User_Id = u.User_Id
    GROUP BY s.User_Id
    ORDER BY Score DESC
    LIMIT 5
    `;
        break;
      case "whackamole":
        // For Whack A Mole, the highest score is best (descending order)
        query = `
         SELECT u.Username, s.Score, s.Moles_Whacked, s.Difficulty_Level as Difficulty
    FROM WhackAMole_Sessions s
    JOIN Users u ON s.User_Id = u.User_Id
    WHERE (s.User_Id, s.Score) IN (
      SELECT User_Id, MAX(Score) as MaxScore
      FROM WhackAMole_Sessions
      GROUP BY User_Id
    )
    ORDER BY s.Score DESC, 
      CASE 
        WHEN s.Difficulty_Level = 'hard' THEN 1
        WHEN s.Difficulty_Level = 'medium' THEN 2
        WHEN s.Difficulty_Level = 'easy' THEN 3
        ELSE 4
      END ASC
    LIMIT 5
  `;
        break;

      case "2048":
        // For 2048, the highest score is best (descending order)
        query = `
    SELECT u.Username, s.Score
    FROM \`2048_Sessions\` s
    JOIN Users u ON s.User_Id = u.User_Id
    WHERE (s.User_Id, s.Score) IN (
      SELECT User_Id, MAX(Score) as MaxScore
      FROM \`2048_Sessions\`
      GROUP BY User_Id
    )
    ORDER BY s.Score DESC
    LIMIT 5
  `;
        break;

      case "memorymatch":
        // For Memory Match, the lowest duration is best (ascending order)
        query = `
          SELECT u.Username, s.Duration as Score, s.Moves, s.Difficulty_Level as Difficulty
          FROM MemoryMatch_Sessions s
          JOIN Users u ON s.User_Id = u.User_Id
          WHERE (s.User_Id, s.Duration) IN (
            SELECT User_Id, MIN(Duration) as MinDuration
            FROM MemoryMatch_Sessions
            GROUP BY User_Id
          )
          ORDER BY s.Duration ASC, 
            s.Moves ASC,
            CASE 
              WHEN s.Difficulty_Level = 'hard' THEN 1
              WHEN s.Difficulty_Level = 'medium' THEN 2
              WHEN s.Difficulty_Level = 'easy' THEN 3
              ELSE 4
            END ASC
          LIMIT 5
        `;
        break;

      default:
        return res.status(400).json({ message: "Invalid game specified" });
    }

    // Execute the query
    const [results] = await pool.execute(query);

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user stats (total games played across all games)
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get counts from all game session tables
    const [stats] = await pool.execute(
      `
      SELECT 
        (SELECT COUNT(*) FROM Sudoku_Sessions WHERE User_Id = ?) as sudoku_count,
        (SELECT COUNT(*) FROM SnakeGame_Sessions WHERE User_Id = ?) as snake_count,
        (SELECT COUNT(*) FROM WhackAMole_Sessions WHERE User_Id = ?) as whackamole_count,
        (SELECT COUNT(*) FROM \`2048_Sessions\` WHERE User_Id = ?) as game2048_count,
        (SELECT COUNT(*) FROM MemoryMatch_Sessions WHERE User_Id = ?) as memorymatch_count
    `,
      [userId, userId, userId, userId, userId]
    );

    // Get best scores for each game
    const [bestScores] = await pool.execute(
      `
      SELECT 
        (SELECT MIN(Duration) FROM Sudoku_Sessions WHERE User_Id = ?) as best_sudoku_time,
        (SELECT MAX(Score) FROM SnakeGame_Sessions WHERE User_Id = ?) as best_snake_score,
        (SELECT MAX(Score) FROM WhackAMole_Sessions WHERE User_Id = ?) as best_whackamole_score,
        (SELECT MAX(Score) FROM \`2048_Sessions\` WHERE User_Id = ?) as best_2048_score,
        (SELECT MIN(Duration) FROM MemoryMatch_Sessions WHERE User_Id = ?) as best_memorymatch_time
    `,
      [userId, userId, userId, userId, userId]
    );

    const totalGames = Object.values(stats[0]).reduce((a, b) => a + b, 0);

    res.status(200).json({
      totalGames,
      gameCounts: stats[0],
      bestScores: bestScores[0],
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};
