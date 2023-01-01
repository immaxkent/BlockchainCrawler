const {
  evaluateCurrentSolveInstanceHex,
  returnCurrentLevel,
} = require("./evaluateHelper.js");

const filterLogs = async (
  logs,
  nodeProvider,
  fromBlock,
  switchoverBlock,
  web3,
  mappingDataPath
) => {
  const filteredData = [];
  for (log of logs) {
    let txn = await nodeProvider.getTransaction(log.transactionHash);
    let block = await nodeProvider.getBlock(log.blockNumber);
    const filteredLog = {
      player: String(txn.from),
      eventType:
        String(log.topics[0]) ===
        evaluateCurrentSolveInstanceHex(fromBlock, switchoverBlock)
          ? "LevelCompleted"
          : "InstanceCreated",
      blockNumber: log.blockNumber,
      timeStamp: block.timestamp,
      level: returnCurrentLevel(
        fromBlock,
        switchoverBlock,
        txn,
        log,
        web3,
        mappingDataPath
      ),
    };
    // console.log("filteredLog", filteredLog);
    console.log("filteredLog.level", filteredLog.level, log.blockNumber);
    filteredData.push(filteredLog);
  }

  return filteredData;
};

module.exports = filterLogs;
