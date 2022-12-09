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
      console.log("number of records dropped = " + dataDrop.length);
      console.log("logs processed & written to dataDrop file");
    
      
      //now, we need to iterate the dataDrop array to yield an orderedData array. 
      //This is later compared to the current leaderboard and updated as necessary

      //so, the first task is to initialize the orderedData with a first entry
      //we do this by processing the first log dropped, or dataDrop[0];

      for (let i = 0; i < 1; i++) {
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
          playerProfile.player = dataDrop[i].player;
          levelsProfile.levelAddress = dataDrop[i].level;
          levelsProfile.isCompleted = dataDrop[i].eventType === "InstanceCreated" ? false : true;
          levelsProfile.timeCreated = dataDrop[i].timeStamp;
          levelsProfile.timeSolved = "";
          levelsProfile.timeTaken = "";
          playerProfile.levels.push(levelsProfile);
          orderedData.push(playerProfile);
        } catch (error) {
          console.log(error);
        }
      }
      console.log("orderedData initialized with first entry");
      fs.writeFileSync(orderedDataPath, JSON.stringify(orderedData));

      //now, we iterate over the rest of the dataDrop array, 
      //and compare each entry to the orderedData array
      //this requires that we take each 'i' value for the dataDrop,
      //and compare it to each 'k' value for the orderedData

      for (let i = 0; i < dataDrop.length; i++) {
        try {
          //first we create an object to compare against our pre=filled orderedData array;
            let profileToBeCompared = {
              player: dataDrop[i].player,
              levels: [],
              totalTimeTakenToCompleteLevels: 0
            };
            let levelsProfile = {
              levelAddress: dataDrop[i].level, 
              isCompleted: (dataDrop[i].eventType === "InstanceCreated") ? false : true,
              timeCreated: (dataDrop[i].eventType === "InstanceCreated") ? dataDrop[i].timeStamp : "this is a solved level",
              timeSolved: (dataDrop[i].eventType === "LevelCompleted") ? dataDrop[i].timeStamp : "not yet solved",
              timeTaken: ""
            };
            profileToBeCompared.levels.push(levelsProfile);

            //next, we check the orderedData array and see if the playerAddress in profileToBeCompared
            //already exists - ergo, this player has already been added

            let checkPlayer = obj => obj.player === profileToBeCompared.player;
            if (orderedData.some(checkPlayer) === true) {
              //the player exists, let's find him, and
              //check his levels to see if he has attempted this before
              console.log("player already exists - let's find him")
              for (let j = 0; j < orderedData.length; j++) {
                if (orderedData[j].player === profileToBeCompared.player) {
                  //we have found the player, let's check his levels
                  console.log("got him! let's check his levels")
                  let checkLevel = obj => obj.levelAddress === profileToBeCompared.levels.levelAddress;
                  if (orderedData[j].levels.some(checkLevel) === true) {
                    //the level exists, let's find it and update it
                    console.log("yep, he's tried it before - has he completed it?")
                    if (profileToBeCompared.levels.isCompleted === true) { 
                      console.log("yes, he has completed it - no further action needed")
                      return; 
                    } 
                      else {
                        console.log("nope, the last attempt was a fail. Let's re-write this level's data");
                        for (let k = 0; k < orderedData[j].levels.length; k++) {
                          if (orderedData[j].levels[k].levelAddress === profileToBeCompared.levels.levelAddress) {
                            //we have found the level, let's update it
                            orderedData[j].levels[k].isCompleted = profileToBeCompared.levels.isCompleted;
                            orderedData[j].levels[k].timeSolved = profileToBeCompared.levels.timeSolved;
                            orderedData[j].levels[k].timeTaken = profileToBeCompared.levels.timeTaken;
                          }
                        }

                      }
                  }
                  else {
                    console.log("nope, he hasn't tried it before - let's add it to his levels");
                    orderedData[j].levels.push(profileToBeCompared.levels[0]);
                  }
                }
                           
              }
            }
            else {
              //the player does not exist, let's add him
              orderedData.push(profileToBeCompared);
              console.log("we found a new player - pushing him to the array. New length = " + orderedData.length)
            }

            
          } catch (error) {
   console.log(error);
 }
    //   for (let i = 0; i < dataDrop.length; i++) {
    //     try { 
    //       let playerProfile = {
    //         player: "",
    //         levels: [],
    //         totalTimeTakenToCompleteLevels: ""
    //       };
    //       let levelsProfile = {
    //         levelAddress: "", 
    //         isCompleted: false,
    //         timeCreated: "",
    //         timeSolved: "",
    //         timeTaken: ""
    //       };
    //       for (let j = 0; j < orderedData.length; j++) {
    //         //first, we look to see if this player is the same as in the entry.
    //         console.log(orderedData.length + " is the length of ordered data. The value of j is " + j);
    //         if (orderedData[j].player === dataDrop[i].player) {
    //           console.log(`this player ${dataDrop[i].player} is the same as in the entry`);
    //           //if it is, meaning they must have some levelProfile
    //           //we then iterate through the levelProfiles to see if the levelAddress is the same
    //           for (let k = 0; k < orderedData[j].levels.length; k++) {
    //             //so first, we find if this level has been attempted by this player
    //             if (orderedData[j].levels[k].levelAddress === dataDrop[i].level) {
    //               console.log("level attempted by player");
    //               /*if this level has been attempted, we check if it has been completed.
    //               */
    //               if (orderedData[j].levels[k].isCompleted === true) {
    //                 console.log("level already completed");
    //                 break;
    //               } else {
    //                 console.log("level not completed, so re-writing their first attempt data");
    //                 orderedData[j].levels[k].isCompleted = dataDrop[i].eventType === "LevelCompleted" ? true : false;
    //                 orderedData[j].levels[k].timeSolved = dataDrop[i].timeStamp;
    //                 orderedData[j].levels[k].timeTaken = orderedData[j].levels[k].timeSolved - orderedData[j].levels[k].timeCreated;
    //                 //we also need to update the playerProfile
    //                 orderedData[j].totalTimeTakenToCompleteLevels += orderedData[j].levels[k].timeTaken;
    //                 break;
    //               }
    //             } else {
    //               console.log("level NOT attempted by player, so pushing this level into their levels array")
    //               //if it is not yet attempted, we overwrite the existing level profile
    //               //since we only want to record the latest InstanceCreated before a completion,
    //               //to get accurate time stats
    //               levelsProfile.levelAddress = dataDrop[i].level;
    //               levelsProfile.isCompleted = dataDrop[i].eventType === "LevelCompleted" ? true : false;
    //               levelsProfile.timeCreated = dataDrop[i].timeStamp;
    //               levelsProfile.timeSolved = "";
    //               levelsProfile.timeTaken = "";
    //               orderedData[j].levels.push(levelsProfile);
    //               break;
    //             }
    //           }
    //         }
    //         else {
    //           console.log(`this player ${dataDrop[i].player} has not yet been entered into orderedData`);
    //           //if the player does not exist in the orderedData array
    //           //we create a new playerProfile and drop this log's details in
    //           playerProfile.player = dataDrop[i].player;
    //           levelsProfile.levelAddress = dataDrop[i].level;
    //           levelsProfile.isCompleted = dataDrop[i].eventType === "LevelCompleted" ? true : false;
    //           levelsProfile.timeCreated = dataDrop[i].timeStamp;
    //           levelsProfile.timeSolved = "";
    //           levelsProfile.timeTaken = "";
    //           playerProfile.levels.push(levelsProfile);
    //           orderedData.push(playerProfile);
    //           break;
    //         }
    //         break;
    //       }
    //     }
    //   catch (error) {
    //     console.log(error);
    //   }
    

      

    //   // for (let i = 0; i < dataDrop.length; i++) {
    //   //   try { 
    //   //     let playerProfile = {
    //   //       player: "",
    //   //       levels: [],
    //   //       totalTimeTakenToCompleteLevels: ""
    //   //     };
    //   //     let levelsProfile = {
    //   //       levelAddress: "", 
    //   //       isCompleted: false,
    //   //       timeCreated: "",
    //   //       timeSolved: "",
    //   //       timeTaken: ""
    //   //     };


    //   //     //first, we look to see if this player is the same as in the entry.
    //   //     if (orderedData[i].player === dataDrop[i].player) {
    //   //       //if it is, meaning they must have some levelProfile in the levels object,
    //   //       //we go on to modify this player's entry:



    //   //       //so we check if this is InstanceCreated or LevelCompleted.
    //   //       //depending on which it is, we log the relevant details within the levels object
            
    //   //       if (dataDrop[i].eventType === "InstanceCreated")/*ergo this is InstanceCreated, so we 
    //   //       iterate over the levels array and see if they've attempted this level before.
    //   //       Then, we check if this level.isCompleted == true
    //   //       in the levels object. 
    //   //       */ {
    //   //         for (let j = 0; j < orderedData[i].levels.length; j++) {
    //   //           if (orderedData[i].levels[j].levelAddress === dataDrop[i].level) {
    //   //             if (orderedData[i].levels[j].isCompleted === true) {
    //   //               //if so, we return, as we only record the first time of completion. 
    //   //               return;
    //   //             } else {
    //   //               //if not, so the player exists, has tried and failed and this is another attempt, 
    //   //               //we create a new levelsProfile object to push to the levels array
    //   //               levelsProfile.levelAddress = dataDrop[i].level;
    //   //               levelsProfile.isCompleted = false;
    //   //               levelsProfile.timeCreated = dataDrop[i].timeStamp;
    //   //               levelsProfile.timeSolved = "";
    //   //               levelsProfile.timeTaken = "";
    //   //               //we know that this person already has a profile matching, so we can 
    //   //               //just push to the levels array
    //   //               orderedData[i].levels.push(levelsProfile)
    //   //             }
                  
    //   //             } else {
    //   //               //this is a first attempt. so write this person a new levelProfile
    //   //             }
    //   //           }
    //   //         }
    //   //         else /*ergo this is LevelCompleted, 
    //   //          so modify the
    //   //         timeCompleted
    //   //         timeTakenToCompleteLevels
    //   //         NumberOfLevelsCompleted
    //   //         isCompleted
    //   //         */{
    //   //           return;
    //   //         };
    //   //       } 
            
            
    //   //       else {
    //   //         //if it is not, we create a new entry for them:
    //   //         let playerProfile = {
    //   //           player: "",
    //   //           levels: {
    //   //             levelAddress: "", 
    //   //             isCompleted: false,
    //   //             timeCreated: "",
    //   //             timeSolved: "",
    //   //             timeTaken: ""
    //   //           } ,
    //   //           totalTimeTakenToCompleteLevels: "",
    //   //           numberOfLevelsCompleted: ""
    //   //         };
    //   //         /* & push the newly created levels object into the player's profile */
    //   //         orderedData.push(playerProfile);
    //   //       }
    //   //     } 
    //   // catch (error) {
    //   //   console.log(error);
    //   // };

    //   //   //push a player to orderedData if they are not already there
    //   //     // if (dataDrop[i].player === undefined) {
    //   //     //   player = dataDrop[i].player;
    //   //     //   orderedData[i].push(player);
    //   //     // } else {
    //   //     //   return;
    //   //     //     //else logic goes here
    //   //     // }
    //   //     // //if this is an instance creation, note the timestamp of the log
    //   //     // if (dataDrop[i].eventType === "InstanceCreated") {
    //   //     //   orderedData[i].instanceCreated == (dataDrop[i].timeStamp);
    //   //     // } else {
    //   //     // }
    //   //     // //check to see if the player has completed this level - if not, levelsCompleted ++ && push this level to the levelsCompleted array
    //   //     // if (dataDrop[i].level === String) {
    //   //     //   return;
    //   //     // } else {

    //   //     // }

    //   // }
    //   console.log("data in dataDrop iterated and re-written into orderedData file" + JSON.stringify(orderedData));
    // }
    fs.writeFileSync(orderedDataPath, JSON.stringify(orderedData));
};
}

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