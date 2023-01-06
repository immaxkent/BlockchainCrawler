const fs = require("fs");

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
  console.log(
    "log.blockNumber",
    log.blockNumber,
    "switchoverBlock",
    switchoverBlock
  );
  if (!evaluateIfWeHavePassedReDeployment(log.blockNumber, switchoverBlock)) {
    console.log("ive not passed switchover");
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
    console.log("ive passed redeployment", log.topics[3]);
    const topicsArray = [{ type: "address", name: "level" }];
    const topic0Array = web3.eth.abi.decodeParameters(
      topicsArray,
      String(log.topics[3])
    );
    const newLevelAddress = topic0Array.level;
    console.log("topic0Array", topic0Array, log.blockNumber);
    result = newLevelAddress;
  }
  return result;
};

const evaluatePlayerScore = (
  totalTimeTakenToCompleteLevels,
  totalNumberOfLevelsCompleted
) => {
  const totalNumberOfEthernautLevels = evaluateCurrentNumberOfEthernautLevels();
  let score = 0;
  if (totalNumberOfLevelsCompleted) {
    score =
      100 *
      ((0.9 * totalNumberOfLevelsCompleted) / totalNumberOfEthernautLevels +
        (15 * totalNumberOfLevelsCompleted) / totalTimeTakenToCompleteLevels);
  }
  return score;
};

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
  const ethernautLevels = require("../../../utils/ethernautLevels.json");
  return ethernautLevels.length;
};

module.exports = {
  evaluateCurrentSolveInstanceHex,
  evaluateIfWeHavePassedReDeployment,
  returnCurrentLevel,
  evaluatePlayerScore,
  evaluateNewPlayerScore,
  evaluateCurrentNumberOfEthernautLevels,
};
