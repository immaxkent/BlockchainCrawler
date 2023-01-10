const fs = require("fs");
const { Network, Alchemy, Utils } = require("alchemy-sdk");
const Web3 = require("web3");
const networks = require("../../../utils/networkDetails.json");
const fetchNewData = require("./fetchNetworkData.js");
const updateLeaderBoard = require("./updateLeaderBoard.js");
const fetchAndAddAliases = require("./fetchAndAddAliases.js");
const consoleCustomiser = require("../../../utils/consoleCustomiser");
const web3 = new Web3();
const { log } = consoleCustomiser({ delay: 50, randomized: true });

const fetchNewDataAndUpdateLeaderBoard = async () => {
  for (network of networks) {
    await fetchNewData(network, web3, log);
    await log(
      `Trumpets, glory and resounding success! ${network.name} was crawled like a 19th century garter!`
    );
  }
  await log(
    "Did you bring your towel, punk?! The networks were crawled and the leaderboard is about to be updated!!"
  );
  updateLeaderBoard();
  await log(
    ".........deck the halls, ya filthy animal! The Leader Board has been.... UPDATED"
  );
  // fetchAndAddAliases();
  // await log(
  //   "get your magnifying glass out, Sherlock, because the leader board now belies.... the ALIASES!"
  // );
};

fetchNewDataAndUpdateLeaderBoard();

module.exports = fetchNewDataAndUpdateLeaderBoard;
