const initialiseNodeProvider = require("../crawlHistoricalData/initialiseNodeProvider");
const returnLatestBlock = require("./returnLatestBlock");
const {
  evaluateNewPlayerScore,
} = require("../crawlHistoricalData/evaluateHelper");

const callBlockChain = async (network, web3, log) => {
  let logs = [];
  await log(
    "Now, hold onto your horses! The " +
      network.name +
      " crawl has been initiated. Please wait some moments..."
  );

  const nodeProvider = initialiseNodeProvider(network);
  const incrementer = 2000;
  const upperBlock = await returnLatestBlock(network);
  let lastFromBlock = network.lastFrom;
  let nextToBlock = network.lastFrom + incrementer;

  do {
    const logDump = await nodeProvider.getLogs({
      fromBlock: lastFromBlock,
      toBlock: nextToBlock,
      address: network.statisticsAddress,
      topics: [
        "0x18f89fb58208351d054bc0794e723a333ae0a74acd73825a9f31d89af0c67551",
      ],
    });

    if (logDump) {
      for (log of logDump) {
        console.log(log);
        let dataArray1 = [{ type: "address", name: "player" }];
        let dataArray2 = [{ type: "uint256", name: "time" }];
        let dataArray3 = [{ type: "uint256", name: "number" }];

        const topic1Array = web3.eth.abi.decodeParameters(
          dataArray1,
          String(log.topics[1])
        );

        const topic2Array = web3.eth.abi.decodeParameters(
          dataArray2,
          String(log.topics[2])
        );

        const topic3Array = web3.eth.abi.decodeParameters(
          dataArray3,
          String(log.topics[3])
        );

        const score = () => {
          returnedScore = "";
          if (
            evaluateNewPlayerScore(topic2Array.time, topic3Array.number) > 0 &&
            evaluateNewPlayerScore(topic2Array.time, topic3Array.number) < 100
          ) {
            returnedScore = evaluateNewPlayerScore(
              topic2Array.time,
              topic3Array.number
            );
          } else {
            returnedScore = 0;
          }
          return returnedScore;
        };

        try {
          let playerEntry = {
            player: topic1Array.player,
            totalTimeTakenToCompleteLevels: topic2Array.time,
            totalNumberOfLevelsCompleted: topic3Array.number,
            playerScore: score(),
            alias: "",
          };
          logs.push(playerEntry);
        } catch (error) {
          console.log(error);
        }
      }
      lastFromBlock = nextToBlock + 1;
      nextToBlock = lastFromBlock + incrementer;
    }
  } while (nextToBlock < upperBlock);

  console.log(`BOOM! The action added new entries from ${network.name}...`);

  return logs;
};

module.exports = callBlockChain;
