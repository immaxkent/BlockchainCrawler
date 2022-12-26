const fs = require("fs");
const { Network, Alchemy, Utils } = require("alchemy-sdk");
const Web3 = require("web3");


const networkDataJson = fs.readFileSync("../utils/networkDetails.json");
const networkData = JSON.parse(networkDataJson);

const crawlHistoricalData = () => {

  for (let i = 0; i < 1; i++) {

    let network = networkData;
    let currentNetwork = network[i].networkDecleration.split(".")[1];
    

    const settings = {
      apiKey: `${network[i].API_Key}`,
      network: currentNetwork
    }


    const filteredDataPath = `../Networks/${network[i].name}/filtered${network[i].name}Data.json`;
    const alchemy = new Alchemy(settings);
    const infuraWeb3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/eae969da77634e23bef9256f6d66e2f6'));
    const web3 = new (Web3);
    const macroDataDrop = [];


    const retreiveData = async (fromBlock, toBlock) => {

  
    const switchoverBlock = network[i].switchoverBlock;
    const oldEthernautAddress = network[i].oldAddress;
    const newEthernautAddress = network[i].newAddress;
    const oldSolveInstanceHex = "0x9dfdf7e3e630f506a3dfe38cdbe34e196353364235df33e5a3b588488d9a1e78";
    const newSolveInstanceHex = "0x5038a30b900118d4e513ba62ebd647a96726a6f81b8fda73c21e9da45df5423d";
    const dataDrop = [];
  

  
  const evaluateIfWeHavePassedReDeployment = (check) => {
  if (check >= switchoverBlock) return true;
  }

  const evaluateCurrentSolveInstanceHex = (check) => {
    let solveInstanceHex = "";
    if (!evaluateIfWeHavePassedReDeployment(check)) {
      solveInstanceHex = oldSolveInstanceHex;
    } else { solveInstanceHex = newSolveInstanceHex};
    return solveInstanceHex;
  }

  const returnEndPointClient = (iValue) => {
    if (iValue < 4) { return alchemy.core } 
    else if (iValue = 4) { return infuraWeb3 };

  }

  let logs = await returnEndPointClient(i).getLogs({
      fromBlock,
      toBlock,
      address: !evaluateIfWeHavePassedReDeployment(fromBlock) ? oldEthernautAddress : newEthernautAddress, 
      topics: []
    });

    for (log of logs) {
      let txn = await returnEndPointClient(i).getTransaction(log.transactionHash);
      let block = await returnEndPointClient(i).getBlock(log.blockNumber);
  
      const topicsArray = [
        { type: "address", name: "level" },
      ];
      const datasArray = [
        { type: 'address', name: "level"}
      ]
      const topic0Array = web3.eth.abi.decodeParameters(topicsArray, String(log.topics[3])); 
      //const dataArray = web3.eth.abi.decodeLog(datasArray, String(log.data));
      //HERE WE NEED TO FIGURE OUT HOW TO DECODE THE DATA!
      
      try {
        let data = {
          player: String(txn.from),
          eventType: String(log.topics[0]) === evaluateCurrentSolveInstanceHex(fromBlock) ? "LevelCompleted" : "InstanceCreated",
          blockNumber: log.blockNumber,
          timeStamp: block.timestamp,
          level: /*!evaluateIfWeHavePassedReDeployment(toBlock) ? dataArray.level : */topic0Array.level
        };
        dataDrop.push(data);
        console.log(log);
      } catch (error) {
        console.log(error);
      }
    }



  dataDrop.forEach((drop) => {
    macroDataDrop.push(drop);
  });

  console.log("jubilations! " + macroDataDrop.length + " of " + network[i].name + " logs filtered.");
}

const writeData = async () => {

  let filteredData = [];

  macroDataDrop.forEach(game => {
  const { player } = game;
  const existingPlayerRecord = filteredData.find((filteredGame) => filteredGame.player === player);
  const existingPlayerRecordIndex = filteredData.findIndex((filteredGame) => filteredGame.player === player);

  if (!!existingPlayerRecord) {
    // player exists already, check levels

    // has player done level yet?
    const existingEntryForLevel = existingPlayerRecord.levels.find((existingLevel) => game.level === existingLevel.levelAddress);
    let updatedLevels = [];

    // if there is existing level entry for user, and it is not completed, lets update level array if not add a new level
    if (existingEntryForLevel && !existingEntryForLevel.isCompleted) {
      updatedLevels = existingPlayerRecord.levels.map((existingLevel) => {
        // if level has been completed this time, update that level entry to completed
        if (existingLevel.levelAddress === game.level && game.eventType === "LevelCompleted") {
          return {
            levelAddress: game.level,
            isCompleted: true,
            timeCreated: existingLevel.timeCreated,
            timeSolved: game.timeStamp,
            timeTaken: game.timeStamp - existingLevel.timeCreated,
          }
          // if new try, overwrite last try
        } else if (existingLevel.levelAddress === game.level && game.eventType === "InstanceCreated") {
          return {
            levelAddress: game.level,
            isCompleted: false,
            timeCreated: game.timeStamp,
            timeSolved: null,
            timeTaken: 0,
          }
        } else {
          return existingLevel;
        }
      });
      // if level already completed, do nothing
    } else if (existingEntryForLevel && existingEntryForLevel.isCompleted){
      updatedLevels = existingPlayerRecord.levels;
      // if attempt at new level, add to levels array
    } else {
      updatedLevels = [
        ...existingPlayerRecord.levels,
        {
          levelAddress: game.level,
          isCompleted: false,
          timeCreated: game.timeStamp,
          timeSolved: null,
          timeTaken: 0
        }
      ]
      console.log('adding new level')
    }
    existingPlayerRecord.levels = updatedLevels; 
    console.log('existing playerRecord updated' + updatedLevels);

    // overwrite original player record with player containing new level records
    filteredData[existingPlayerRecordIndex] = existingPlayerRecord;
  } else {
    // player doesn't exist, create new profile with one level
    const newLevel = {
      levelAddress: game.level,
      isCompleted: (game.eventType === "InstanceCreated") ? false : true,
      timeCreated: (game.eventType === "InstanceCreated") ? game.timeStamp : "this is a solved level",
      timeSolved: (game.eventType === "LevelCompleted") ? game.timeStamp : "not yet solved",
      timeTaken: 0
    };

    const newFilteredEntry = {
      player,
      levels: [newLevel],
    };

    filteredData.push(newFilteredEntry)
    console.log('newFilteredEntry written ');
    console.log(filteredData);
  }
});

fs.writeFileSync(filteredDataPath, JSON.stringify(filteredData), { flag: 'a' });
console.log("old crawler did what it does best, and wrote us some filtered data! " + macroDataDrop.length + " to be precise!")
};

  const retreiveAndWrite = async () => {

    try {

      const upperBlock = network[i].toBlock;
      let lastFromBlock = network[i].fromBlock; //the first deployed Ethernaut block
      let nextToBlock = network[i].fromBlock + 2000; //plus difference 3605, then 10,000 thereafter until 7968901

      do {
       await retreiveData(lastFromBlock, nextToBlock);
        lastFromBlock = nextToBlock;
        nextToBlock += 2000;
      } while (lastFromBlock < upperBlock);
      await writeData()
      console.log("gracious me, the logs have been written!!")
      process.exit(0);

    } catch (error) {

      console.log(error);
      process.exit(1);

    };
  };

  retreiveAndWrite();

  }
};

crawlHistoricalData();

