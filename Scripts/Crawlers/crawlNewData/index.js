const fs = require("fs");
const { Network, Alchemy, Utils } = require("alchemy-sdk");
const fetchNewData = require("./fetchNetworkData.js");
const updatePlayersBoard = require("./updatePlayersBoard.js");
const consoleCustomiser = require("../../../utils/consoleCustomiser");
const { logger } = consoleCustomiser({ delay: 50, randomized: true });
const fetchAndAddAliases = require("./fetchAndAddAliases.js");
const Web3 = require("web3");
const web3 = new Web3();
const networks = require("../../../utils/networkDetails.json");
const freshEntriesCrawlPath = "../../../Boards/freshEntriesCrawl.json";


const fetchNewDataAndUpdatePlayersBoard = async () => {

  fs.writeFileSync(freshEntriesCrawlPath, JSON.stringify([]));

  for (network of networks) {
    await fetchNewData(network, web3, logger, freshEntriesCrawlPath);
    await logger(
      `Trumpets, glory and resounding success! ${network.name} was crawled like a 19th century garter!`
    );
  }
  await logger(
    "Did you bring your towel, punk?! The networks were crawled and the leaderboard is about to be updated!!"
  );
  
  updatePlayersBoard();
  await logger(
    ".........deck the halls, ya filthy animal! The Leader Board has been.... UPDATED"
  );

  // fetchAndAddAliases();
  // await logger(
  //   "get your magnifying glass out, Sherlock, because the leader board now belies.... the ALIASES!"
  // );
};

fetchNewDataAndUpdatePlayersBoard();

module.exports = fetchNewDataAndUpdatePlayersBoard;
