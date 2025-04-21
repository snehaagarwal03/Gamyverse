const jwt = require("jsonwebtoken");
const { pool } = require("../db");
require("dotenv").config();

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const [users] = await pool.execute(
        "SELECT User_Id, Username, Email FROM Users WHERE User_Id = ?",
        [decoded.id]
      );

      if (users.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = {
        id: users[0].User_Id,
        username: users[0].Username,
        email: users[0].Email,
      };

      next();
    } catch (error) {
      console.error("Error in auth middleware:", error);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
