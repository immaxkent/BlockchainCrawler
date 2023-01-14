const fs = require("fs");
const allPlayersBoardPath = `../../../Boards/allPlayersBoard.json`;
const freshEntriesCrawl = require("../../../Boards/freshEntriesCrawl.json");
const testBoardPath = "../../../Boards/testBoard.json";

const updatePlayersBoard = () => {

  freshEntriesCrawl.forEach((entry) => {
    const allPlayersBoard = JSON.parse(fs.readFileSync(allPlayersBoardPath))
    const index = allPlayersBoard.findIndex((p) => p.player === entry.player);
    if (index !== -1) {
      allPlayersBoard[index].totalDifficultyFaced += entry.totalDifficultyFaced;
      if (entry.totalNumberOfLevelsCompleted > allPlayersBoard[index].totalNumberOfLevelsCompleted) {
        allPlayersBoard[index].totalNumberOfLevelsCompleted = entry.totalNumberOfLevelsCompleted;
        allPlayersBoard[index].averageTimeTakenToCompleteALevel = entry.averageTimeTakenToCompleteALevel;
      }
    } else {
      allPlayersBoard.push(entry);
    }
    fs.writeFileSync(testBoardPath, JSON.stringify(allPlayersBoard));
  })


};

module.exports = updatePlayersBoard;
