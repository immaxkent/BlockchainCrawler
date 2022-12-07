const fs = require("fs");
const { Network, Alchemy, Utils } = require("alchemy-sdk");
const Web3 = require("web3");

const apiKey = "2A-1DH2kKKB-rNj3Bjgm8yz3clAn6bgp";
const settings = {
  apiKey: apiKey,
  network: Network.ETH_GOERLI,
};

const dataDropPath = "./lastDataDrop.json";
const orderedDataPath = "./lastDataDrop.json";

const alchemy = new Alchemy(settings);
const web3 = new(Web3);

const retreiveData = async () => {
  let logs = await alchemy.core.getLogs({
    fromBlock: "0x7a7316",
    toBlock: "0x7a7343",
// the true value for from and to are 0x72fac0 to 0x768b45 and 0x768b45 to 0x799885 respectively for the old ethernaut address, covering in total blocks from 7535296 to 7768901
    address: "0xD2e5e0102E55a5234379DD796b8c641cd5996Efd",
//this 0x42E7014a9D1f6765e76fA2e69532d808F2fe27E3 is the old ethernaut address. The new one is 0xD2e5e0102E55a5234379DD796b8c641cd5996Efd and started on block 7968901
    topics: [
        //"0x5038a30b900118d4e513ba62ebd647a96726a6f81b8fda73c21e9da45df5423d",
        //"0x8be8bd7b4324b3d47aca5c3f64cb70e8f645e6fe94da668699951658f6384179"
    ]
    });
    
const dataDrop = [];
const orderedData = [];
const solveInstanceHex = "0x5038a30b900118d4e513ba62ebd647a96726a6f81b8fda73c21e9da45df5423d";

    for (log of logs) {
        let txn = await alchemy.core.getTransaction(log.transactionHash);
        let block = await alchemy.core.getBlock(log.blockNumber);

        const dataArray = [
          {type: "address", name: "level"},
        ];        
        const topic3Array = web3.eth.abi.decodeParameters(dataArray, String(log.topics[3]));
        
        try {
             let data = {
                player: String(txn.from),
                eventType: String(log.topics[0]) === solveInstanceHex ? "LevelCompleted" : "InstanceCreated",
                blockNumber: log.blockNumber,
                timeStamp: block.timestamp,
                level: topic3Array.level
             };
             dataDrop.push(data);
             console.log(log);
        } catch (error) {
            console.log(error);
        }
      }
      fs.writeFileSync(dataDropPath, JSON.stringify(dataDrop));
      
      //now, we need to iterate the dataDrop array to yield an orderedData array. 
      //This is later compared to the current leaderboard and updated as necessary

      for (let i = 0; i < dataDrop.length; i++) {
        //push a player to orderedData if they are not already there
          if (dataDrop[i].player === undefined) {
            player = dataDrop[i].player;
            orderedData[i].push(player);
          } else {
            return;
              //else logic goes here
          }
          // //if this is an instance creation, note the timestamp of the log
          // if (dataDrop[i].eventType === "InstanceCreated") {
          //   orderedData[i].instanceCreated == (dataDrop[i].timeStamp);
          // } else {
          // }
          // //check to see if the player has completed this level - if not, levelsCompleted ++ && push this level to the levelsCompleted array
          // if (dataDrop[i].level === String) {
          //   return;
          // } else {

          // }

      }
      fs.writeFileSync(orderedDataPath, JSON.stringify(orderedData));
    console.log("logs processed & written to files");
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