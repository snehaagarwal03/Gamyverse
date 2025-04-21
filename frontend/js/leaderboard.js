function getAuthToken() {
  return localStorage.getItem("token");
}
async function addToLeaderboard(game, score, difficulty = "normal") {
  if (typeof saveHighScore === "function") {
    const extraData = { difficultyLevel: difficulty };

    if (game === "sudoku" || game === "memorymatch") {
      await saveHighScore(game, score, true, extraData);
    } else {
      await saveHighScore(game, score, false, extraData);
    }
  } else {
    console.error("saveHighScore function not found");
  }
}

async function displayLeaderboard(game) {
  const leaderboardBody = document.getElementById("leaderboard-body");
  if (!leaderboardBody) return;

  leaderboardBody.innerHTML = "";

  try {
    const response = await fetch(
      `${window.API_URL}/sessions/leaderboard/${game}`,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard");
    }

    const leaderboard = await response.json();

    if (leaderboard.length === 0) {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `<td colspan="4">No scores yet. Be the first to set a record!</td>`;
      leaderboardBody.appendChild(emptyRow);
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    leaderboard.forEach((entry, index) => {
      const row = document.createElement("tr");
      let displayScore = entry.Score;

      if (game === "sudoku" || game === "memorymatch") {
        displayScore = formatTime(displayScore);
        if (game === "memorymatch") {
          row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${entry.Username}</td>
                    <td>${displayScore}</td>
                    <td>${entry.Moves || 0}</td>
                    <td>${entry.Difficulty || "normal"}</td>
                `;
        } else {
          row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${entry.Username}</td>
                    <td>${displayScore}</td>
                    <td>${entry.Difficulty || "normal"}</td>
                `;
        }
      } else if (game === "whackamole") {
        row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${entry.Username}</td>
                    <td>${displayScore}</td>
                    <td>${entry.Moles_Whacked || 0}</td>
                    <td>${entry.Difficulty || "easy"}</td>
                `;
      } else {
        row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${entry.Username}</td>
                    <td>${displayScore}</td>
                    ${entry.Difficulty ? `<td>${entry.Difficulty}</td>` : ""}
                `;
      }

      if (currentUser && entry.Username === currentUser.username) {
        row.style.backgroundColor = "rgba(0, 255, 204, 0.1)";
      }

      leaderboardBody.appendChild(row);
    });
  } catch (error) {
    console.error(`Error fetching ${game} leaderboard:`, error);
    const errorRow = document.createElement("tr");
    errorRow.innerHTML = `<td colspan="4">Error loading leaderboard. Please try again later.</td>`;
    leaderboardBody.appendChild(errorRow);
  }
}

function formatTime(totalSeconds) {
  if (!totalSeconds || totalSeconds === null) return "--:--";

  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
