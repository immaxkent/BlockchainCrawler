const fs = require("fs");
const { Network, Alchemy, Utils } = require("alchemy-sdk");
const Web3 = require("web3");
const networks = require("../../utils/networkDetails.json");
const fetchNetworkData = require("./fetchNetworkData.js");
const updateLeaderBoard = require("./updateLeaderBoard.js");

const fetchNewDataAndUpdateLeaderBoard = async () => {
  const lastCronDrop = await fetchNetworkData(networks);
  updateLeaderBoard(lastCronDrop);
};

fetchNewDataAndUpdateLeaderBoard();

////////////////////////////////////////////////////////////////////

// const apiKey = "2A-1DH2kKKB-rNj3Bjgm8yz3clAn6bgp";
// const settings = {
//   apiKey: apiKey,
//   network: Network.ETH_GOERLI,
// };

// const crawlAndUpdateLeaderBoard = () => {
//   const dataPath = "../../allPlayersBoard";
//   const alchemy = new Alchemy(settings);
//   const infuraWeb3 = new Web3(
//     new Web3.providers.HttpProvider(
//       "https://sepolia.infura.io/v3/eae969da77634e23bef9256f6d66e2f6"
//     )
//   );
//   const web3 = new Web3();
//   const networkDataJson = fs.readFileSync("../utils/networkDetails.json");
//   const network = JSON.parse(networkDataJson);

//   for (let i = 0; i < 5; i++) {
//     const lastCronDrop = [];

//     const returnEndPointClient = (iValue) => {
//       if (iValue < 4) {
//         return alchemy.core;
//       } else if ((iValue = 4)) {
//         return infuraWeb3;
//       }
//     };

//     const returnFromBlockForThisNetwork = (i) => {
//       let blockValue = lastNetworkFromBlocks[i];
//       return blockValue;
//     };

//     const crawlNetwork = async (fromBlock) => {
//       let logs = await returnEndPointClient(i).getLogs({
//         fromBlock,
//         toBlock: returnFromBlockForThisNetwork(i),
//         address: network[i].newEthernautAddress,
//         topics: [],
//       });

//       for (log of logs) {
//         dataArray0 = [{ type: "address", name: "player" }];
//         dataArray1 = [{ type: "uint256", name: "time" }];
//         dataArray2 = [{ type: "uint256", name: "number" }];

//         const topic0Array = web3.eth.abi.decodeParameters(
//           dataArray0,
//           String(log.topics[0])
//         );
//         const topic1Array = web3.eth.abi.decodeParameters(
//           dataArray1,
//           String(log.topics[1])
//         );
//         const topic2Array = web3.eth.abi.decodeParameters(
//           dataArray2,
//           String(log.topics[2])
//         );

//         try {
//           let playerEntry = {
//             player: topic0Array.player /*String(txn.from)*/,
//             totalTimeTakenToCompleteLevels: topic1Array.time,
//             totalNumberOfLevelsCompleted: topic2Array.number,
//             alias: "",
//           };
//           lastCronDrop.push(playerEntry);
//         } catch (error) {}
//       }
//       console.log(
//         `tremendous! the cron job added all new entries from ${network[i].name}`
//       );
//       lastNetworkFromBlocks[i] += 7200;
//     };
//     crawlNetwork(lastNetworkFromBlocks[i]);

//     const updateLeaderBoard = () => {
//       //for each profile in the lastCronDrop,
//       //check if their profile exists
//       //find the index if it does exist
//       //use find to update entries apart from alias values
//       //if there is an alias value, return it
//     };
//     updateLeaderBoard();
//   }
// };

// crawlAndUpdateLeaderBoard();
