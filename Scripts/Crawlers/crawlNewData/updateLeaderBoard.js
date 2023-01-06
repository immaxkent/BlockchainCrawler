const fs = require("fs");
const leaderBoardPath = "../../../Boards/leaderBoard.json";
const leaderBoard = require(leaderBoardPath);
const newPlayersBoard = require("../../../Boards/newPlayersBoard.json");
const testBoardPath = "../../../Boards/testBoard.json";

const updateLeaderBoard = () => {
  newPlayersBoard.forEach((profile) => {
    const index = leaderBoard.findIndex((p) => p.player === profile.player);
    if (index !== -1) {
      leaderBoard[index] = profile;
    } else {
      leaderBoard.push(profile);
    }
  });

  const sortedLeaderboard = leaderBoard.sort((a, b) => {
    return b.playerScore - a.playerScore;
  });

  fs.writeFileSync(testBoardPath, JSON.stringify(sortedLeaderboard));
};

module.exports = updateLeaderBoard;
