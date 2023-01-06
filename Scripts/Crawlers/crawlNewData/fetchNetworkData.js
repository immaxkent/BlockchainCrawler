const fs = require("fs");
const callBlockChain = require("./callBlockchain");
const newPlayersDropPath = "../../../Boards/newPlayersBoard.json";
const updateNetworkDetails = require("./updateNetworkDetails");

const fetchNewData = async (network, web3, log) => {
  let logs = await callBlockChain(network, web3, log);

  const lastNewPlayersBoard = JSON.parse(fs.readFileSync(newPlayersDropPath));
  const newPlayersBoard = lastNewPlayersBoard.concat(logs);

  await log(
    `Adding ${logs.length} player profiles to newPlayersBoard.json from ${network.name}`
  );

  fs.writeFileSync(newPlayersDropPath, JSON.stringify(newPlayersBoard));
  if (process.env.ENVIRONMENT == "PROD") {
    await updateNetworkDetails(network);
  }
};

module.exports = fetchNewData;
