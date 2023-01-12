const fs = require("fs");
const callBlockChain = require("./callBlockchain");
const updateNetworkDetails = require("./updateNetworkDetails");
const returnLatestBlock = require("./returnLatestBlock");

const fetchNewData = async (network, web3, logger, freshEntriesCrawlPath) => {
  const upperBlock = await returnLatestBlock(network);
  let logs = await callBlockChain(network, web3, logger, upperBlock);

  const lastFreshEntriesBoard = JSON.parse(fs.readFileSync(freshEntriesCrawlPath)) ? JSON.parse(fs.readFileSync(freshEntriesCrawlPath)) : [];

  const freshEntriesCrawl = lastFreshEntriesBoard.concat(logs);

  await logger(
    `Adding ${logs.length} emit profiles to freshEntriesCrawl from ${network.name}`
  );

  fs.writeFileSync(freshEntriesCrawlPath, JSON.stringify(freshEntriesCrawl));
  if (process.env.ENVIRONMENT == "PROD") {
    await updateNetworkDetails(network, upperBlock);
  }
};

module.exports = fetchNewData;
