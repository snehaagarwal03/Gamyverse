const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");
require("dotenv").config();

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, gender, age } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username, email, and password" });
    }

    const [userExists] = await pool.execute(
      "SELECT * FROM Users WHERE Username = ? OR Email = ?",
      [username, email]
    );

    if (userExists.length > 0) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const [result] = await pool.execute(
      "INSERT INTO Users (Username, Email, Password, Gender, Age) VALUES (?, ?, ?, ?, ?)",
      [username, email, hashedPassword, gender || null, age || null]
    );

    const token = jwt.sign(
      { id: result.insertId, username },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: result.insertId,
        username,
        email,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username and password" });
    }

    const [users] = await pool.execute(
      "SELECT User_Id, Username, Email, Password FROM Users WHERE Username = ?",
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.User_Id, username: user.Username },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.User_Id,
        username: user.Username,
        email: user.Email,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await pool.execute(
      "SELECT User_Id, Username, Email, Gender, Age, Date_Joined FROM Users WHERE User_Id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    const [stats] = await pool.execute(
      `
      SELECT 
        (SELECT COUNT(*) FROM Sudoku_Sessions WHERE User_Id = ?) as sudoku_games,
        (SELECT COUNT(*) FROM SnakeGame_Sessions WHERE User_Id = ?) as snake_games,
        (SELECT COUNT(*) FROM WhackAMole_Sessions WHERE User_Id = ?) as whackamole_games,
        (SELECT COUNT(*) FROM \`2048_Sessions\` WHERE User_Id = ?) as game2048_games,
        (SELECT COUNT(*) FROM MemoryMatch_Sessions WHERE User_Id = ?) as memorymatch_games
    `,
      [userId, userId, userId, userId, userId]
    );

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

    res.status(200).json({
      user,
      stats: {
        ...stats[0],
        total_games: Object.values(stats[0]).reduce((a, b) => a + b, 0),
      },
      bestScores: bestScores[0],
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { age, gender } = req.body;

    await pool.execute(
      "UPDATE Users SET Age = ?, Gender = ? WHERE User_Id = ?",
      [age || null, gender || null, userId]
    );

    const [users] = await pool.execute(
      "SELECT User_Id, Username, Email, Gender, Age, Date_Joined FROM Users WHERE User_Id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
