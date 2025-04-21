const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, getUserProfile);
router.post(
  "/update",
  protect,
  (req, res, next) => {
    console.log("POST /api/users/update hit");
    next();
  },
  updateUserProfile
);
module.exports = router;
