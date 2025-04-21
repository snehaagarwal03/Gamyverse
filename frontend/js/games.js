function getAuthToken() {
  return localStorage.getItem("token");
}

async function updateHighScores() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || !getAuthToken()) return;

  try {
    const response = await fetch(`${window.API_URL}/sessions/stats`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user stats");
    }

    const data = await response.json();

    updateElementText(
      "snake-highscore",
      data.bestScores.best_snake_score || "0"
    );
    updateElementText(
      "sudoku-besttime",
      formatTime(data.bestScores.best_sudoku_time) || "--:--"
    );
    updateElementText(
      "whackamole-highscore",
      data.bestScores.best_whackamole_score || "0"
    );
    updateElementText("2048-highscore", data.bestScores.best_2048_score || "0");
    updateElementText(
      "memorymatch-besttime",
      formatTime(data.bestScores.best_memorymatch_time) || "--:--"
    );
    updateElementText(
      "pacman-highscore",
      data.bestScores.best_pacman_score || "0"
    );

    updateElementText("total-games", data.totalGames || "0");
  } catch (error) {
    console.error("Error updating high scores:", error);
  }
}

function updateElementText(id, text) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

async function saveHighScore(game, score, isTime = false, extraData = {}) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || !getAuthToken()) return false;

  try {
    let gameData = {};

    if (isTime) {
      const seconds = typeof score === "string" ? timeToSeconds(score) : score;
      gameData.duration = seconds;
    } else {
      gameData.score = score;
    }

    gameData = { ...gameData, ...extraData };

    let endpoint;
    switch (game) {
      case "sudoku":
        endpoint = `${window.API_URL}/sessions/sudoku`;
        break;
      case "snake":
        endpoint = `${window.API_URL}/sessions/snake`;
        break;
      case "whackamole":
        endpoint = `${window.API_URL}/sessions/whackamole`;
        break;
      case "2048":
        endpoint = `${window.API_URL}/sessions/2048`;
        break;
      case "memorymatch":
        endpoint = `${window.API_URL}/sessions/memorymatch`;
        break;
      case "pacman":
        endpoint = `${window.API_URL}/sessions/pacman`;
        break;
      default:
        throw new Error("Invalid game specified");
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(gameData),
    });

    if (!response.ok) {
      throw new Error("Failed to save game session");
    }

    return true;
  } catch (error) {
    console.error(`Error saving ${game} score:`, error);
    return false;
  }
}

function compareTime(time1, time2) {
  if (time1 === "--:--") return false;
  if (time2 === "--:--") return true;

  const seconds1 = timeToSeconds(time1);
  const seconds2 = timeToSeconds(time2);

  return seconds1 < seconds2;
}

function timeToSeconds(timeStr) {
  if (!timeStr || timeStr === "--:--") return Infinity;

  const [minutes, seconds] = timeStr.split(":").map(Number);
  return minutes * 60 + seconds;
}

function formatTime(totalSeconds) {
  if (!totalSeconds || totalSeconds === null) return "--:--";

  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
