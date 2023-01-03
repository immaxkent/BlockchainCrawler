const fs = require("fs");
const { Network, Alchemy, Utils } = require("alchemy-sdk");
const Web3 = require("web3");
const networks = require("../../utils/networkDetails.json");
const fetchNetworkData = require("./fetchNetworkData.js");
const updateLeaderBoard = require("./updateLeaderBoard.js");
const fetchAndAddAliases = require("./addAliases.js");

const fetchNewDataAndUpdateLeaderBoard = async () => {
  const lastCronDrop = await fetchNetworkData(networks);
  updateLeaderBoard(lastCronDrop);
  //fetchAndAddAliases();
};

fetchNewDataAndUpdateLeaderBoard();
