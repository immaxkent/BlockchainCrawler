const fs = require("fs");
const dataPath = "../../Boards/allPlayersBoard.json";
const { evaluateHistoricalProfile } = require("../../Tools/evaluateHelper.js")

const compileAllPlayersBoard = (networks) => {
  let allPlayers = [];
  for (network of networks) {
    const networkBoardJson = fs.readFileSync(
      `../../../Networks/${network.name}/${network.name}NetworkBoard.json`
    );
    const networkBoard = JSON.parse(networkBoardJson);
    const networkBoardWithTotals = evaluateHistoricalProfile(networkBoard, network);
    networkBoardWithTotals.forEach((profile) => {
      if (profile.totalNumberOfLevelsCompleted > 1) {
        allPlayers.push(profile);
      }
    });

    console.log(
      `ohhh this is exciting - we have moved the ${network.name} network board to the global all players board!`
    );
  }

  fs.writeFileSync(dataPath, JSON.stringify(allPlayers));
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//I think the following calculation can be moved to evaluateHelper.
//This way, if someone changes the scoring mechanism, they would need to run a thinned out version of crawlHistoricalData/index.js to simply convert all network boards to new all player's boards,
//and then run crawlNewData/index.js via the trigger

// const calculateTimeAndScores = (processedData, network) =>
//   processedData.map((profile) => {
//     let levelCompletedCounter = 0;
//     const totalTimeTakenToCompleteLevels = profile.levels.reduce(
//       (acc, level) => {
//         if (level.isCompleted) {
//           acc = acc + level.timeTaken;
//           levelCompletedCounter++;
//         }
//         return acc;
//       },
//       0
//     );

//     const volumeCompletedParameter = 0.8; //approx. 80% of total attainable score
//     const difficultyFacedParameter = 0.1; //approx 10% of total attainable score
//     const timeTakenParameter = 15; // NOTA.BENE this value has been iterated BY HAND to represent the remaining 10% of total attainable score. The average block time for Ethereum was used as a starting value, and modified slightly thereafter to yield satisfactory score balance

//     const totalDifficultyFacedByPlayer = evaluateTotalDifficultyFaced(profile, network)
//     const totalDifficultyInEthernautGame = evaluateTotalDifficultyInEthernautGame()
//     const totalNumberOfEthernautLevels = evaluateCurrentNumberOfEthernautLevels();
//     let score = 0;
//     if (levelCompletedCounter) {
//       score =
//         100 *
//         ((volumeCompletedParameter * levelCompletedCounter / totalNumberOfEthernautLevels) +
//         (difficultyFacedParameter * totalDifficultyFacedByPlayer / totalDifficultyInEthernautGame) +
//           (timeTakenParameter * levelCompletedCounter) / totalTimeTakenToCompleteLevels);
//     }

//     return {
//       player: profile.player,
//       totalTimeTakenToCompleteLevels,
//       totalNumberOfLevelsCompleted: levelCompletedCounter,
//       playerScore: score,
//       alias: "",
//     };
//   });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = compileAllPlayersBoard;
