const callBlockChain = require("./callBlockchain.js");
const filterLogs = require("./filterLogs.js");
const processFilteredData = require("./processFilteredData.js");
const initialiseNodeProvider = require("./initialiseNodeProvider.js");
const Web3 = require("web3");
const networks = require("../../../utils/networkDetails.json");
const compileAllPlayersBoard = require("./compilePlayersBoard.js");
const writeLeaderBoard = require("./writeLeaderBoard.js");

const generateAllNetworkBoards = async () => {
  for (network of networks) {
    await generateNetworkBoard(network);
  }

  compileAllPlayersBoard(networks);
  writeLeaderBoard();
};

const generateNetworkBoard = async (network) => {
  const fromBlock = network.fromBlock;
  const toBlock = network.toBlock;
  const switchoverBlock = network.switchoverBlock;
  const mappingData = require(`../../../Networks/${network.name}/levelsMapping.json`);

  const nodeProvider = initialiseNodeProvider(network);

  const blockchainLogs = await callBlockChain(
    network,
    nodeProvider,
    fromBlock,
    toBlock,
    switchoverBlock
  );

  const web3 = new Web3();

  const filteredLogs = await filterLogs(
    blockchainLogs,
    nodeProvider,
    fromBlock,
    switchoverBlock,
    web3,
    mappingData
  );

  console.log(
    "gracious me, " + filteredLogs.length + " logs have been written"
  );

  const processedData = processFilteredData(filteredLogs);

  const processedDataPath = `./Networks/${network.name}/${network.name}PlayersBoard.json`;
  fs.writeFileSync(processedDataPath, JSON.stringify(processedData));
};

generateAllNetworkBoards();
