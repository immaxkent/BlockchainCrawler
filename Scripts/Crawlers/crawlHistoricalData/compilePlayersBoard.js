const fs = require("fs");
const dataPath = "../../../allPlayersBoard.json";

const calculateTimeAndScores = (processedData) =>
  processedData.map((profile) => {
    let levelCompletedCounter = 0;
    const totalTimeTakenToCompleteLevels = profile.levels.reduce(
      (acc, level) => {
        if (level.isCompleted) {
          acc = acc + level.timeTaken;
          levelCompletedCounter++;
        }
        return acc;
      },
      0
    );

    const totalNumberOfEthernautLevels = 27;

    let score = 0;
    if (levelCompletedCounter) {
      score =
        100 *
        ((0.9 * levelCompletedCounter) / totalNumberOfEthernautLevels +
          (12 * levelCompletedCounter) / totalTimeTakenToCompleteLevels);
    }
    return {
      player: profile.player,
      totalTimeTakenToCompleteLevels,
      totalNumberOfLevelsCompleted: levelCompletedCounter,
      playerScore: score,
      alias: "",
    };
  });

const compileAllPlayersBoard = (networks) => {
  let allPlayers = [];
  for (network of networks) {
    const networkBoardJson = fs.readFileSync(
      `../../../Networks/${network.name}/${network.name}PlayersBoard.json`
    );
    const networkBoard = JSON.parse(networkBoardJson);
    const networkBoardWithTotals = calculateTimeAndScores(networkBoard);
    console.log("networkBoard", networkBoardWithTotals);
    networkBoardWithTotals.forEach((profile) => {
      if (profile.totalNumberOfLevelsCompleted >= 0) {
        console.log("pushing profile", profile);
        allPlayers.push(profile);
      }
    });

    console.log(
      `ohhh this is exciting - we have moved the ${network.name} network board to the global all players board!`
    );
  }

  fs.writeFileSync(dataPath, JSON.stringify(allPlayers));
};

module.exports = compileAllPlayersBoard;
