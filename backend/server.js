const express = require("express");
const cors = require("cors");
const { testConnection } = require("./db");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const sessionRoutes = require("./routes/sessionRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

testConnection();

app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/", (req, res) => {
  res.send("GamyVerse API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("*", (req, res) => {
  res.status(404).send("API endpoint not found");
});
