const fs = require("fs");
const networks = require("../../utils/networkDetails.json");
const initialiseNodeProvider = require("../Crawlers/crawlHistoricalData/initialiseNodeProvider.js");

const oldSolveInstanceHex =
  "0x9dfdf7e3e630f506a3dfe38cdbe34e196353364235df33e5a3b588488d9a1e78";
const newSolveInstanceHex =
  "0x5038a30b900118d4e513ba62ebd647a96726a6f81b8fda73c21e9da45df5423d";

const evaluateIfWeHavePassedReDeployment = (check, switchoverBlock) => {
  if (check > switchoverBlock) return true;
};

const evaluateCurrentSolveInstanceHex = (check, switchoverBlock) => {
  let solveInstanceHex = "";
  if (!evaluateIfWeHavePassedReDeployment(check, switchoverBlock)) {
    solveInstanceHex = oldSolveInstanceHex;
  } else {
    solveInstanceHex = newSolveInstanceHex;
  }

  return solveInstanceHex;
};

const returnCurrentLevel = (
  fromBlock,
  switchoverBlock,
  txn,
  log,
  web3,
  mappingData
) => {
  let result = "";

  if (!evaluateIfWeHavePassedReDeployment(log.blockNumber, switchoverBlock)) {

    let input = txn.data;
    let input_data = "0x" + input.slice(10);
    if (log.topics[0] === oldSolveInstanceHex) {
      let decodedAddress = web3.eth.abi.decodeParameter(
        "address",
        String(log.data)
      );
      result = mappingData[decodedAddress];
    } else {
      let decodedAddress = web3.eth.abi.decodeParameter(
        "address",
        String(input_data)
      );
      result = mappingData[decodedAddress];
    }
  } else {

    const topicsArray = [{ type: "address", name: "level" }];
    const topic0Array = web3.eth.abi.decodeParameters(
      topicsArray,
      String(log.topics[3])
    );
    const newLevelAddress = topic0Array.level;

    result = newLevelAddress;
  }
  return result;
};

const evaluateHistoricalProfile = (processedData, network) =>
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

    const averageTimeTakenToCompleteALevel = totalTimeTakenToCompleteLevels / levelCompletedCounter;
    const totalDifficultyFacedByPlayer = evaluateTotalDifficultyFaced(profile, network)

    return {
      player: profile.player,
      averageTimeTakenToCompleteALevel,
      totalNumberOfLevelsCompleted: levelCompletedCounter,
      totalDifficultyFaced: totalDifficultyFacedByPlayer,
      //playerScore: score,
      alias: "",
    };
  });

const useScoreEquation = (averageTimeTakenToCompleteALevel, totalDifficultyFacedByPlayer, totalNumberOfLevelsCompleted) => {

  const volumeCompletedParameter = 0.8; //approx. 80% of total attainable score
  const difficultyFacedParameter = 0.1; //approx 10% of total attainable score
  const timeTakenParameter = 15; // NOTA.BENE this value has been iterated BY HAND to represent the remaining 10% of total attainable score. The average block time for Ethereum was used as a starting value, and modified slightly thereafter to yield satisfactory score balance

  const totalDifficultyInEthernautGame = evaluateTotalDifficultyInEthernautGame()
  const totalNumberOfEthernautLevels = evaluateCurrentNumberOfEthernautLevels();



  let score = 0;
  if (totalNumberOfLevelsCompleted) {
    score =
      100 *
      ((volumeCompletedParameter * totalNumberOfLevelsCompleted / totalNumberOfEthernautLevels) +
        (difficultyFacedParameter * totalDifficultyFacedByPlayer / totalDifficultyInEthernautGame) +
        (timeTakenParameter / averageTimeTakenToCompleteALevel));
  }

}
/////////////////////////////////////////////////////////////////////////////////
//ensure these 3 score related euqations are consistent
/////////////////////////////////////////////////////////////////////////////////
const reCalculateScores = (board) => {

  // const unfilteredLeaderBoardPath = "../../Boards/unfilteredLeaderBoard.json";

  const boardWithScores = board.map((player) => {

    const score = useScoreEquation(player.averageTimeTakenToCompleteALevels, player.totalNumberOfLevelsCompleted, player.totalDifficultyFaced);
    return {
      ...player,
      playerScore: score,
    };
  })

  return boardWithScores;

  // fs.writeFileSync(unfilteredLeaderBoardPath, JSON.stringify(boardWithScores, null, 2));
}

const evaluateNewPlayerScore = (
  averageTimeTakenToCompleteALevel,
  totalNumberOfLevelsCompleted
) => {
  const totalNumberOfEthernautLevels = evaluateCurrentNumberOfEthernautLevels();
  let score = 0;
  if (totalNumberOfLevelsCompleted) {
    score =
      100 *
      ((0.9 * totalNumberOfLevelsCompleted) / totalNumberOfEthernautLevels +
        (15 * totalNumberOfLevelsCompleted) /
        (averageTimeTakenToCompleteALevel * totalNumberOfLevelsCompleted));
  }
  return score;
};

const evaluateCurrentNumberOfEthernautLevels = () => {
  const ethernautLevels = require("../../utils/ethernautLevels.json");
  return ethernautLevels.length;
};

const evaluateTotalDifficultyInEthernautGame = () => {
  const difficultyMap = require("../../utils/ethernautLevels.json"); //this represent gameData.json in the main repo
  let totalDifficulty = 0;
  difficultyMap.forEach((level) => {
    totalDifficulty += parseInt(level.difficulty);
  });
  console.log(totalDifficulty)
  return totalDifficulty
}

const evaluateTotalDifficultyFaced = (playerProfile, network) => {
  playerLevelsArray = playerProfile.levels;

  let difficultyCount = 0;

  const difficultyMap = require(`../../Networks/${network.name}/difficultyMap${network.name}.json`);

  playerLevelsArray.forEach((game) => {


    if (game.isCompleted == true) { 


      const thisDifficultyProfile = difficultyMap.find(
        (matchingProfile) => {
          if (matchingProfile.address == game.levelAddress) return matchingProfile;
        }
      );

    
  
      difficultyCount += parseInt(thisDifficultyProfile.difficulty);

    }

  });

  //console.log(difficultyCount)

  return difficultyCount;

};

///////////////////////////////////////////////////////////////////////////////////////////
//here, we write a function to call the blockchain using the 
//txHash to find the emit from the Ethernaut contract
//where the level address is stored. This will allow us to
//determine the difficulty of the level that was just completed

// const evaluateDecodedLevelAddress = async (network, log, initialiseNodeProvider, web3) => {
//   const nodeProvider = initialiseNodeProvider(network, log);
//   const levelAddress = "";

//   try {
//     let block = await nodeProvider.getBlock(log.blockNumber);
//     const logFromEthernaut = await nodeProvider.getLogs({
//       fromBlock: block,
//       toBlock: block,
//       address: network.newAddress,
//       topics: [newSolveInstanceHex],
//     });

//     let txn = await nodeProvider.getTransaction(logFromEthernaut.transactionHash);
//     let input = txn.data;
//     let input_data = "0x" + input.slice(10);

//     levelAddress = web3.eth.abi.decodeParameter(
//       "address",
//       String(input_data)
//     );
//   } catch (error) {console.log(error)}

//   return levelAddress
// };


const evaluateDifficultyInThisStatisticsEmit = async (network, log, web3, nodeProvider) => {

//const evaluateDifficultyAndLevelInThisStatisticsEmit = async (network, log, web3, nodeProvider) => {


  const decodedAddress = await evaluateDecodedLevelAddress(network, log, web3, nodeProvider)
  console.log("--------------------- decoded address is " + decodedAddress)
  console.log("blockHash is " + log.blockHash)


  const difficultyMap = require(`../../Networks/${network.name}/difficultyMap${network.name}.json`);

  const thisDifficultyProfileIndex = difficultyMap.findIndex(
    (matchingLevel) =>
      decodedAddress == matchingLevel.address
  );

  console.log("difficulty profile index is " + thisDifficultyProfileIndex);
  console.log("difficulty faced here was " + difficultyMap[thisDifficultyProfileIndex].difficulty)
  console.log("level name here is " + difficultyMap[thisDifficultyProfileIndex].name)



  return difficultyMap[thisDifficultyProfileIndex].difficulty;

}

const evaluateDecodedLevelAddress = async (network, log, web3, nodeProvider) => {
 
  let levelAddress = "";

  try {
    let block = log.blockNumber;
    

    const logsFromEthernaut = await nodeProvider.getLogs({
      fromBlock: block,
      toBlock: block,
      address: network.newAddress,
      topics: [newSolveInstanceHex],
    });



    let txn = await nodeProvider.getTransaction(String(log.transactionHash));
    let fromPlayer = String(txn.from)


    const playerTopicArray = [{ type: "address", name: "player" }];
    const levelTopicArray = [{ type: "address", name: "level" }];

    for (log of logsFromEthernaut) {

      const playerArray = web3.eth.abi.decodeParameters(
        playerTopicArray,
        String(log.topics[1])
      );

      if (playerArray.player == fromPlayer) {

        let levelArray = web3.eth.abi.decodeParameters(
          levelTopicArray,
          String(log.topics[3])
        );

        levelAddress = levelArray.level;
      }

    }

  } catch (error) { console.log(error) }



  return levelAddress
};

const evaluateIfThisPlayerHasAlreadyCompletedThisLevel = (player, levelAddress, networkBoard) => {

  const doesPlayerExist = networkBoard.find((entry) => player.address == entry.address);
  const evaluator = false;

  if (doesPlayerExist) {
    const indexOfExistingPlayer = networkBoard.findIndex((player) => player.address == address);
    const existingEntry = networkBoard[indexOfExistingPlayer];
    const existingEntryLevelsArray = existingEntry.levels;

    existingEntryLevelsArray.forEach((level) => {
      if (level.address == levelAddress) {
        evaluator = true
      }
    })
  }

  return evaluator;
}

module.exports = {
  evaluateCurrentSolveInstanceHex,
  evaluateIfWeHavePassedReDeployment,
  returnCurrentLevel,
  evaluateHistoricalProfile,
  evaluateNewPlayerScore,
  evaluateCurrentNumberOfEthernautLevels,
  evaluateTotalDifficultyFaced,
  evaluateTotalDifficultyInEthernautGame,
  useScoreEquation,
  reCalculateScores,
  evaluateDifficultyInThisStatisticsEmit,
  evaluateDecodedLevelAddress,
  evaluateIfThisPlayerHasAlreadyCompletedThisLevel
};
