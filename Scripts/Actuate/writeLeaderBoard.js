const leaderBoardPath = "../../Boards/leaderBoard.json";
const testLeaderBoardPath = "../../Boards/testLeaderBoard.json";
const fs = require("fs");

const writeLeaderBoard = async (logger, reCalculateScores) => {

  const allPlayersBoard = require("../../Boards/allPlayersBoard.json");

  let playersBoardWithScores = reCalculateScores(allPlayersBoard);

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  //here, we need to calculateScores for each player in the players board, and write them to a temporary array.
  //this array will then be sorted, and written to the leaderboard on a condition (e.g number of levels completed must be < 3, or whatever)

  leaderBoard = playersBoardWithScores.sort((a, b) => {
    return b.playerScore - a.playerScore;
  });

  fs.writeFileSync(testLeaderBoardPath, JSON.stringify(leaderBoard));
  await logger(
    "button up your mittens, because the leaders have come forth! Leader board written from historical data."
  );
};

module.exports = writeLeaderBoard;
