const callBlockChain = require("./callBlockchain.js");
const filterLogs = require("./filterLogs.js");
const processFilteredData = require("./processFilteredData.js");
const initialiseNodeProvider = require("./initialiseNodeProvider.js");
const Web3 = require("web3");
const networks = require("../../../utils/networkDetails.json");
const compileAllPlayersBoard = require("./compilePlayersBoard.js");
const writeLeaderBoard = require("./writeLeaderBoard.js");
const consoleCustomiser = require("../../../utils/consoleCustomiser");
const fs = require("fs");
const { log } = consoleCustomiser({ delay: 100, randomized: true });

const generateAllBoards = async () => {
  for (network of networks) {
    await generateNetworkBoard(network, log);
  }

  compileAllPlayersBoard(networks);
  await log(
    "prised be! the players played the players game and got written on the #allPlayersBoard. right on!"
  );
  writeLeaderBoard();
};

const generateNetworkBoard = async (network, log) => {
  const fromBlock = network.fromBlock;
  const toBlock = network.toBlock;
  const switchoverBlock = network.switchoverBlock;
  const mappingData = require(`../../../Networks/${network.name}/levelsMapping.json`);

  const nodeProvider = initialiseNodeProvider(network, log);

  const blockchainLogs = await callBlockChain(
    network,
    nodeProvider,
    fromBlock,
    toBlock,
    switchoverBlock,
    log
  );

  await log("Cwor blimey, " + blockchainLogs.length + " logs have been found");

  const web3 = new Web3();

  const filteredLogs = await filterLogs(
    blockchainLogs,
    nodeProvider,
    fromBlock,
    switchoverBlock,
    web3,
    mappingData
  );

  const filteredDataPath = `../../../Networks/${network.name}/filtered${network.name}Data.json`;
  fs.writeFileSync(filteredDataPath, JSON.stringify(filteredLogs));

  await log("gracious me, " + filteredLogs.length + " logs have been written");

  const processedData = processFilteredData(filteredLogs);

  await log(
    "golly gosh, " + processedData.length + " logs have been processed"
  );

  const processedDataPath = `../../../Networks/${network.name}/${network.name}PlayersBoard.json`;
  fs.writeFileSync(processedDataPath, JSON.stringify(processedData));

  await log(
    "oh my, scores on the doors for " + network.name + " have been compiled"
  );
};

generateAllBoards();
