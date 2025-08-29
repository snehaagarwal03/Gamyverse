# 🎮 GamyVerse - Ultimate Gaming Platform

GamyVerse is a modern, full-stack gaming platform where users can play classic games, track their scores, and manage their profiles. The platform features user authentication, a leaderboard, and a beautiful responsive UI. Built with Node.js, Express, MySQL, and vanilla HTML/CSS/JS.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js&logoColor=white&style=for-the-badge)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-black?logo=express&logoColor=white&style=for-the-badge)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-blue?logo=mysql&logoColor=white&style=for-the-badge)](https://www.mysql.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=for-the-badge)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white&style=for-the-badge)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge)](https://developer.mozilla.org/docs/Web/JavaScript)

## 📸 Project Preview

<img width="1776" height="955" alt="Landing Page" src="https://github.com/user-attachments/assets/fb154cb3-294b-47cb-b4f9-d3c28418ebd0" />

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Acknowledgments](#acknowledgments)

## ✨ Features

- Play classic games: Snake, 2048, Sudoku, Memory Match, Whack-a-Mole
- User authentication (JWT-based)
- Profile management
- Leaderboard and score tracking
- Responsive, modern UI
- Secure password hashing
- MySQL database integration

## 🛠️ Tech Stack

- **Backend:** [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database:** [MySQL](https://www.mysql.com/)
- **Frontend:** [HTML5](https://developer.mozilla.org/docs/Web/HTML), [CSS3](https://developer.mozilla.org/docs/Web/CSS), [JavaScript](https://developer.mozilla.org/docs/Web/JavaScript)
- **Icons:** [Feather Icons](https://feathericons.com/)

## 🗂️ Project Structure

```shell
gamyverse
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── db.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── assets/
│   ├── css/
│   ├── games/
│   ├── js/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│   └── profile.html
└── README.md
```

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/gamyVerse.git
   cd gamyVerse
   ```
2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your MySQL credentials and JWT secret.
4. **Start MySQL server** and create the database (see below).
5. **Run the backend server:**
   ```bash
   npm start
   ```
6. **Serve the frontend:**
   - Use Live Server in the `frontend` folder, or let Express serve static files.

## ⚙️ Environment Setup

- **.env file example:**
  ```env
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=root
  DB_PASSWORD=your_mysql_password
  DB_NAME=gamy_verse
  JWT_SECRET=your_jwt_secret
  PORT=5000
  ```
- **Node.js version:** 18.x or above recommended
- **MySQL version:** 8.x or compatible

## 🙏 Acknowledgments

<p align="center">
   <a href="https://feathericons.com/">Feather Icons</a> &nbsp;|&nbsp;
   <a href="https://nodejs.org/">Node.js</a> &nbsp;|&nbsp;
   <a href="https://expressjs.com/">Express</a> &nbsp;|&nbsp;
   <a href="https://www.mysql.com/">MySQL</a> &nbsp;|&nbsp;
   <a href="https://code.visualstudio.com/">VS Code</a>
</p>

<p align="center">
   <b>⭐ Star this repository if you found it helpful!</b><br>
   <sub>Built with ❤️ by <a href="https://github.com/snehaagarwal03">Sneha Agarwal</a></sub>
</p>
