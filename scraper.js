const fs = require("fs");
const { Network, Alchemy, Utils } = require("alchemy-sdk");
const Web3 = require("web3");

const apiKey = "2A-1DH2kKKB-rNj3Bjgm8yz3clAn6bgp";
const settings = {
  apiKey: apiKey,
  network: Network.ETH_GOERLI,
};

const dataDropPath = "./_gameData.json";
const orderedDataPath = "./orderedData.json";

const alchemy = new Alchemy(settings);
const web3 = new(Web3);

//add some functionality to create hex from numbers

const retreiveData = async () => {
  let logs = await alchemy.core.getLogs({
    fromBlock: "0x72fac0",
    toBlock: "0x7321d0",
    // fromBlock: "0x7a7316",
    // toBlock: "0x7a7343",
// the true value for from and to are 0x72fac0 to 0x768b45 and 0x768b45 to 0x799885 respectively for the old ethernaut address, covering in total blocks from 7535296 to 7768901
    address: "0x42E7014a9D1f6765e76fA2e69532d808F2fe27E3",
//this 0x42E7014a9D1f6765e76fA2e69532d808F2fe27E3 is the old ethernaut address. The new one is 0xD2e5e0102E55a5234379DD796b8c641cd5996Efd and started on block 7968901
    topics: [
        //"0x5038a30b900118d4e513ba62ebd647a96726a6f81b8fda73c21e9da45df5423d",
        "0x8be8bd7b4324b3d47aca5c3f64cb70e8f645e6fe94da668699951658f6384179"
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
        
        //initialise _gameData with the first log entry
        //then, run calls to check if the player exists in the array and write datas accordingly
        try {
          let playerProfile = {
            player: "",
            levels: [],
            totalTimeTakenToCompleteLevels: ""
          };
          let levelsProfile = {
            levelAddress: "", 
            isCompleted: false,
            timeCreated: "",
            timeSolved: "",
            timeTaken: ""
          };
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
      console.log("number of records dropped = " + dataDrop.length);
      console.log("logs processed & written to dataDrop file");
      
      //now, we need to iterate the dataDrop array to yield an orderedData array. 
      //This is later compared to the current leaderboard and updated as necessary

      for (let i = 0; i < dataDrop.length; i++) {
        try { 
          let playerProfile = {
            player: "",
            levels: [],
            totalTimeTakenToCompleteLevels: ""
          };
          let levelsProfile = {
            levelAddress: "", 
            isCompleted: false,
            timeCreated: "",
            timeSolved: "",
            timeTaken: ""
          };


          //first, we look to see if this player is the same as in the entry.
          if (orderedData[i].player === dataDrop[i].player) {
            //if it is, meaning they must have some levelProfile in the levels object,
            //we go on to modify this player's entry:



            //so we check if this is InstanceCreated or LevelCompleted.
            //depending on which it is, we log the relevant details within the levels object
            
            if (dataDrop[i].eventType === "InstanceCreated")/*ergo this is InstanceCreated, so we 
            iterate over the levels array and see if they've attempted this level before.
            Then, we check if this level.isCompleted == true
            in the levels object. 
            */ {
              for (let j = 0; j < orderedData[i].levels.length; j++) {
                if (orderedData[i].levels[j].levelAddress === dataDrop[i].level) {
                  if (orderedData[i].levels[j].isCompleted === true) {
                    //if so, we return, as we only record the first time of completion. 
                    return;
                  } else {
                    //if not, so the player exists, has tried and failed and this is another attempt, 
                    //we create a new levelsProfile object to push to the levels array
                    levelsProfile.levelAddress = dataDrop[i].level;
                    levelsProfile.isCompleted = false;
                    levelsProfile.timeCreated = dataDrop[i].timeStamp;
                    levelsProfile.timeSolved = "";
                    levelsProfile.timeTaken = "";
                    //we know that this person already has a profile matching, so we can 
                    //just push to the levels array
                    orderedData[i].player.levels.push(levelsProfile)
                  }
                  
                  } else {
                    //this is a first attempt. so write this person a new levelProfile
                  }
                }
              }
              else /*ergo this is LevelCompleted, 
               so modify the
              timeCompleted
              timeTakenToCompleteLevels
              NumberOfLevelsCompleted
              isCompleted
              */{
                
              };
            } 
            
            
            else {
              //if it is not, we create a new entry for them:
              // let playerProfile = {
              //   player: "",
              //   levels: {
              //     levelAddress: "", 
              //     isCompleted: false,
              //     timeCreated: "",
              //     timeSolved: "",
              //     timeTaken: ""
              //   } ,
              //   totalTimeTakenToCompleteLevels: "",
              //   numberOfLevelsCompleted: ""
              // };
              /* & push the newly created levels object into the player's profile */
              orderedData.push(playerProfile);
            }
          } 
      catch (error) {
        console.log(error);
      };

        //push a player to orderedData if they are not already there
          // if (dataDrop[i].player === undefined) {
          //   player = dataDrop[i].player;
          //   orderedData[i].push(player);
          // } else {
          //   return;
          //     //else logic goes here
          // }
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
      console.log("data in dataDrop iterated and re-written into orderedData file");
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