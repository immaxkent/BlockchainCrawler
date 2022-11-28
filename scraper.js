const fs = require("fs");
const { Network, Alchemy, Utils } = require("alchemy-sdk");

const apiKey = "2A-1DH2kKKB-rNj3Bjgm8yz3clAn6bgp";
const settings = {
  apiKey: apiKey,
  network: Network.ETH_GOERLI,
};

const dataPath = "./lastDataDrop.json";

const alchemy = new Alchemy(settings);

const retreiveData = async () => {
  let logs = await alchemy.core.getLogs({
    fromBlock: "0x799881",
    toBlock: "0x799c69",
// the true value for from and to are 0x72fac0 and 0x799885 respectively
    address: "0x42E7014a9D1f6765e76fA2e69532d808F2fe27E3",
//this ^^ is the old ethernaut address. The new one is 0xD2e5e0102E55a5234379DD796b8c641cd5996Efd
    topics: [
        //"0x7bf7f1ed7f75e83b76de0ff139966989aff81cb85aac26469c18978d86aac1c2"
    ]
    });
    
const dataDrop = [];

    for (log of logs) {
        let txn = await alchemy.core.getTransaction(log.transactionHash);
        try {
             let data = {
                player: String(txn.from),
                /*
                percentageOfLevelsSolved
                playerScore
                ...and other desirable data points
                */
             };
             dataDrop.push(data);
        } catch (error) {
            console.log(error);
        }
    }
    fs.writeFileSync(dataPath, JSON.stringify(dataDrop));
    console.log(logs);
};

const retreiveAndWrite = async () => {
  try {
    await retreiveData();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

retreiveAndWrite();


