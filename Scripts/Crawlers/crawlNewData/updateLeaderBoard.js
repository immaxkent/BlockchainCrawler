const leaderBoardPath = "../../../Boards/leaderBoard.json";
const testBoardPath = "../../../Boards/testBoard.json";

const updateLeaderBoard = (dataDrop) => {
  const lastVersionOfLeaderBoard = JSON.parse(fs.readFileSync(leaderBoardPath));

  dataDrop.forEach((profile) => {
    if (lastVersionOfLeaderBoard.find((p) => p.player === profile.player)) {
      const index = lastVersionOfLeaderBoard.findIndex(
        (p) => p.player === profile.player
      );
      lastVersionOfLeaderBoard[index] = profile;
    } else {
      const index = lastVersionOfLeaderBoard.findIndex(
        (p) => p.playerScore === profile.playerScore
      );
      lastVersionOfLeaderBoard.splice(index, 0, profile);
    }
  });

  fs.writeFileSync(testBoardPath, JSON.stringify(lastVersionOfLeaderBoard));
};

module.exports = updateLeaderBoard;
