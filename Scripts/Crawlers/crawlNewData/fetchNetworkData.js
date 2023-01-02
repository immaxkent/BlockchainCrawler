const initialiseNodeProvider = require("../crawlHistoricalData/initialiseNodeProvider");
const networkDataPath = "../../../utils/networkDetails.json";

const fetchNetworkData = async (networks) => {
  let logs = [];

  for (network of networks) {
    const nodeProvider = initialiseNodeProvider(network);
    const incrementer = 2000;

    const upperBlock = network.nextTo;
    let lastFromBlock = network.lastFrom; //the first deployed Ethernaut block
    let nextToBlock = lastFromBlock + incrementer; //plus difference 3605, then 10,000 thereafter until 7968901

    do {
      const logDump = await nodeProvider.getLogs({
        fromBlock: lastFromBlock,
        toBlock: nextToBlock,
        address: network.statisticsAddress,
        topics: [],
      });

      for (log of logDump) {
        dataArray0 = [{ type: "address", name: "player" }];
        dataArray1 = [{ type: "uint256", name: "time" }];
        dataArray2 = [{ type: "uint256", name: "number" }];

        const topic0Array = web3.eth.abi.decodeParameters(
          dataArray0,
          String(log.topics[0])
        );
        const topic1Array = web3.eth.abi.decodeParameters(
          dataArray1,
          String(log.topics[1])
        );
        const topic2Array = web3.eth.abi.decodeParameters(
          dataArray2,
          String(log.topics[2])
        );

        try {
          let playerEntry = {
            player: topic0Array.player /*String(txn.from)*/,
            totalTimeTakenToCompleteLevels: topic1Array.time,
            totalNumberOfLevelsCompleted: topic2Array.number,
            alias: "",
          };
          //lastCronDrop.push(playerEntry)
          logs.push(playerEntry);
        } catch (error) {
          console.log(error);
        }
      }
      console.log(
        `tremendous! the cron job added all new entries from ${network.name}`
      );
    } while (nextToBlock < upperBlock);

    const oldNetworkConfiguration = networks;
    for (let i = 0; i < oldNetworkConfiguration.length; i++) {
      if (oldNetworkConfiguration[i].name === network.name) {
        oldNetworkConfiguration[i].lastFrom = nextToBlock + 1;
        oldNetworkConfiguration[i].nextTo = nextToBlock + incrementer;
      }
    }
    fs.writeFileSync(networkDataPath, JSON.stringify(oldNetworkConfiguration));
  }

  //now, update the nextwork with the new lastFrom and lastTo blocks

  ///////////////////////////////////////////////////////////////////////////////////
  return logs;
};

module.exports = fetchNetworkData;

///////////////////////////////////////////////////////////////////////////////////
// const fromBlock = network.fromBlock;
// const toBlock = network.toBlock;
// const mappingData = require(`../../../Networks/${network.name}/levelsMapping.json`);

// const nodeProvider = initialiseNodeProvider(network);

// const logDump = await nodeProvider.getLogs({
//     fromBlock,
//     toBlock,
//     address,
//     topics: [],
//   });

///////////////////////////////////////////////////////////////////////////////////
//     for (log of logs) {

//         dataArray0 = [
//           { type: "address", name: "player" }
//         ];
//         dataArray1 = [
//           { type: "uint256", name: "time" }
//         ];
//         dataArray2 = [
//           { type: "uint256", name: "number" }
//         ]

//         const topic0Array = web3.eth.abi.decodeParameters(dataArray0, String(log.topics[0]));
//         const topic1Array = web3.eth.abi.decodeParameters(dataArray1, String(log.topics[1]));
//         const topic2Array = web3.eth.abi.decodeParameters(dataArray2, String(log.topics[2]));

//         try {
//           let playerEntry = {

//             player: topic0Array.player/*String(txn.from)*/,
//             totalTimeTakenToCompleteLevels: topic1Array.time,
//             totalNumberOfLevelsCompleted: topic2Array.number,
//             alias: ""

//           }
//           lastCronDrop.push(playerEntry)
//         } catch (error) { }

//       }
//       console.log(`tremendous! the cron job added all new entries from ${network[i].name}`)
//       lastNetworkFromBlocks[i] += 7200;
//     }

// module.exports = fetchNetworkData;
///////////////////////////////////////////////////////////////////////////////////

// const blockchainLogs = await callBlockchain(
//     network,
//     nodeProvider,
//     fromBlock,
//     toBlock,
//     switchoverBlock
// );

// const web3 = new Web3();

// const filteredLogs = await filterLogs(
//     blockchainLogs,
//     nodeProvider,
//     fromBlock,
//     switchoverBlock,
//     web3,
//     mappingData
// );

// const filteredDataPath = `./Networks/${network.name}/filtered${network.name}Data.json`;
// fs.writeFileSync(filteredDataPath, JSON.stringify(filteredLogs));

// console.log(
//     "gracious me, " + filteredLogs.length + " logs have been written"
// );

// const processedData = processFilteredData(filteredLogs);

// const processedDataPath = `./Networks/${network.name}/${network.name}PlayersBoard.json`;
// fs.writeFileSync(processedDataPath, JSON.stringify(processedData));
// }
