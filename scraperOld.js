const fs = require("fs");
const { Network, Alchemy, Utils } = require("alchemy-sdk");
const Web3 = require("web3");

const apiKey = "2A-1DH2kKKB-rNj3Bjgm8yz3clAn6bgp";
const settings = {
  apiKey: apiKey,
  network: Network.ETH_GOERLI,
};

const dataDropPath = "./lastDataDrop.json";
const orderedDataPath = "./orderedData.json";

const alchemy = new Alchemy(settings);
const web3 = new (Web3);
//const completedData = [];

const retreiveData = async (fromBlock, toBlock) => {
  let logs = await alchemy.core.getLogs({
    fromBlock,
    toBlock,
    // the true value for from and to are 0x72fac0 to 0x768b45 and 0x768b45 to 0x799885 respectively for the old ethernaut address, covering in total blocks from 7535296 to 7768901
    address: "0x42E7014a9D1f6765e76fA2e69532d808F2fe27E3", //old ethernaut address
    //address: "0xD2e5e0102E55a5234379DD796b8c641cd5996Efd", //new ethernaut address
    topics: [
      //"0x9dfdf7e3e630f506a3dfe38cdbe34e196353364235df33e5a3b588488d9a1e78", //solve instance hex for old ethernaut address
      //"0x7bf7f1ed7f75e83b76de0ff139966989aff81cb85aac26469c18978d86aac1c2", //create instance hex for old ethernaut address

      //"0x5038a30b900118d4e513ba62ebd647a96726a6f81b8fda73c21e9da45df5423d", //solve instance hex for new ethernaut address
      //"0x8be8bd7b4324b3d47aca5c3f64cb70e8f645e6fe94da668699951658f6384179" //instance created hex for new ethernaut address
    ]
  });

  const calculateTotalTimeTakenToCompleteLevels = (levels) => {
    let timeTaken = 0;
    levels.forEach(level => {
      if (timeTaken) timeTaken += level.timeTaken
    });
    return timeTaken;
  }

  const dataDrop = [];
  const solveInstanceHex = "0x9dfdf7e3e630f506a3dfe38cdbe34e196353364235df33e5a3b588488d9a1e78";
  //const solveInstanceHexOld = "0x9dfdf7e3e630f506a3dfe38cdbe34e196353364235df33e5a3b588488d9a1e78";
  //const solveInstanceHexNew = "0x5038a30b900118d4e513ba62ebd647a96726a6f81b8fda73c21e9da45df5423d";

  for (log of logs) {
    let txn = await alchemy.core.getTransaction(log.transactionHash);
    let block = await alchemy.core.getBlock(log.blockNumber);

    const dataArray = [
      { type: "address", name: "level" },
    ];
    const topic3Array = web3.eth.abi.decodeParameters(dataArray, String(log.topics[1])); //topics[3] if referring to the new Ethernaut address

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
  //completedData.push(dataDrop);
  fs.writeFileSync(dataDropPath, JSON.stringify(dataDrop));
  console.log("number of records dropped = " + dataDrop.length);
  console.log("logs processed & written to dataDrop file");

  let orderedData = [];

  dataDrop.forEach(game => {
  const { player } = game;
  const existingPlayerRecord = orderedData.find((orderedGame) => orderedGame.player === player);
  // line below can be done better
  const existingPlayerRecordIndex = orderedData.findIndex((orderedGame) => orderedGame.player === player);

  if (!!existingPlayerRecord) {
    // player exists already, check levels

    // has player done level yet?
    const existingEntryForLevel = existingPlayerRecord.levels.find((existingLevel) => game.level === existingLevel.levelAddress);
    let updatedLevels = [];

    // if there is existing level entry for user, lets update level array if not add a new level
    if (existingEntryForLevel) {
      updatedLevels = existingPlayerRecord.levels.map((existingLevel) => {
        if (existingLevel.levelAddress !== game.level || existingLevel.isCompleted === true) {
          return existingLevel;
        }

        // if level has been completed this time, update that level entry to completed
        if (game.eventType === "LevelCompleted") {
          const existingLevelNowCompleted = {
            levelAddress: game.level,
            isCompleted: true,
            timeCreated: existingLevel.timeCreated,
            timeSolved: game.timeStamp,
            timeTaken: game.timeStamp - existingLevel.timeCreated
          }
          return existingLevelNowCompleted;
        }
      });
    } else {
      updatedLevels = [
        ...existingPlayerRecord.levels,
        {
          levelAddress: game.level,
          isCompleted: false,
          timeCreated: game.timeStamp,
          timeSolved: null,
          timeTaken: null
        }
      ]
    }
    existingPlayerRecord.levels = updatedLevels; //?? - might need to clone
    console.log('existing playerRecord updated' /*existingPlayerRecord*/);

    // now levels have changed, recalculate timeTakenToCompleteLevels
    existingPlayerRecord.totalTimeTakenToCompleteLevels = calculateTotalTimeTakenToCompleteLevels(updatedLevels);

    // overwrite original player record with player containing new level records
    orderedData[existingPlayerRecordIndex] = existingPlayerRecord;
  } else {
    // player doesn't exist, create new profile with one level
    const newLevel = {
      levelAddress: game.level,
      isCompleted: (game.eventType === "InstanceCreated") ? false : true,
      timeCreated: (game.eventType === "InstanceCreated") ? game.timeStamp : "this is a solved level",
      timeSolved: (game.eventType === "LevelCompleted") ? game.timeStamp : "not yet solved",
      timeTaken: null
    };

    const newOrderedEntry = {
      player,
      levels: [newLevel],
      totalTimeTakenToCompleteLevels: null
    };

    orderedData.push(newOrderedEntry)
    console.log('newOrderedEntry written' /*existingPlayerRecord*/);
  }
});
fs.writeFileSync(orderedDataPath, JSON.stringify(orderedData));
};


// const existingOrderedData = await fs.readFileSync(orderedDataPath, {encoding:'utf8', flag:'r'});
// console.log("existing ordered data array: " + existingOrderedData);
// const existingOrderedDataJson = JSON.parse(existingOrderedData);
// let orderedData = existingOrderedDataJson ? existingOrderedDataJson : [];


  const retreiveAndWrite = async () => {
    // delete ordered data
    const fromBlock = "0x7a7316";
    //const fromBlock = "0x72fac0";
    const toBlock = "0x7a7343";
    //const toBlock = "0x7308d5";
    let lastFromBlock = 7632928; //the first deployed Ethernaut block
    let nextToBlock = 7638901; //plus difference 3605, then 10,000 thereafter until 7968901
    //fs.writeFileSync(dataDropPath, JSON.stringify(dataDrop));
    try {
      // write this fiunction in a loop incrementing from and to block each time

      lastFromBlockHex = await web3.utils.toHex(lastFromBlock);
      nextToBlockHex = await web3.utils.toHex(nextToBlock);
      do {
        console.log(lastFromBlockHex);
        await retreiveData(lastFromBlockHex, nextToBlockHex);
        lastFromBlock = nextToBlock;
        nextToBlock += 10000;
        console.log(nextToBlock, nextToBlockHex);
      } while (nextToBlock < 7638901)

      //await retreiveData(fromBlock, toBlock);

      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }

    

  };

  // const filterData = () => {

  //   let orderedData = [];
  //   completedData.forEach(game => {
  // const { player } = game;
  // const existingPlayerRecord = orderedData.find((orderedGame) => orderedGame.player === player);
  // // line below can be done better
  // const existingPlayerRecordIndex = orderedData.findIndex((orderedGame) => orderedGame.player === player);
  
  // if (!!existingPlayerRecord) {
  //   // player exists already, check levels
  
  //   // has player done level yet?
  //   const existingEntryForLevel = existingPlayerRecord.levels.find((existingLevel) => game.level === existingLevel.levelAddress);
  //   let updatedLevels = [];
  
  //   // if there is existing level entry for user, lets update level array if not add a new level
  //   if (existingEntryForLevel) {
  //     updatedLevels = existingPlayerRecord.levels.map((existingLevel) => {
  //       if (existingLevel.levelAddress !== game.level || existingLevel.isCompleted === true) {
  //         return existingLevel;
  //       }
  
  //       // if level has been completed this time, update that level entry to completed
  //       if (game.eventType === "LevelCompleted") {
  //         const existingLevelNowCompleted = {
  //           levelAddress: game.level,
  //           isCompleted: true,
  //           timeCreated: existingLevel.timeCreated,
  //           timeSolved: game.timeStamp,
  //           timeTaken: game.timeStamp - existingLevel.timeCreated
  //         }
  //         return existingLevelNowCompleted;
  //       }
  //     });
  //   } else {
  //     updatedLevels = [
  //       ...existingPlayerRecord.levels,
  //       {
  //         levelAddress: game.level,
  //         isCompleted: false,
  //         timeCreated: game.timeStamp,
  //         timeSolved: null,
  //         timeTaken: null
  //       }
  //     ]
  //   }
  //   existingPlayerRecord.levels = updatedLevels; //?? - might need to clone
  //   console.log('existing playerRecord updated' /*existingPlayerRecord*/);
  
  //   // now levels have changed, recalculate timeTakenToCompleteLevels
  //   existingPlayerRecord.totalTimeTakenToCompleteLevels = calculateTotalTimeTakenToCompleteLevels(updatedLevels);
  
  //   // overwrite original player record with player containing new level records
  //   orderedData[existingPlayerRecordIndex] = existingPlayerRecord;
  // } else {
  //   // player doesn't exist, create new profile with one level
  //   const newLevel = {
  //     levelAddress: game.level,
  //     isCompleted: (game.eventType === "InstanceCreated") ? false : true,
  //     timeCreated: (game.eventType === "InstanceCreated") ? game.timeStamp : "this is a solved level",
  //     timeSolved: (game.eventType === "LevelCompleted") ? game.timeStamp : "not yet solved",
  //     timeTaken: null
  //   };
  
  //   const newOrderedEntry = {
  //     player,
  //     levels: [newLevel],
  //     totalTimeTakenToCompleteLevels: null
  //   };
  
  //   orderedData.push(newOrderedEntry)
  //   console.log('newOrderedEntry written' /*existingPlayerRecord*/);
  // }
  //   });
  //   fs.writeFileSync(orderedDataPath, JSON.stringify(orderedData));
  // };
  retreiveAndWrite();
  //filterData();