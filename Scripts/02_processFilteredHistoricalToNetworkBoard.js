const fs = require("fs");

const networkDataJson = fs.readFileSync("../utils/networkDetails.json");
const networkData = JSON.parse(networkDataJson);

const processFilteredDataToNetworkBoards = () => {

    let network = networkData;

    for (let i = 0; i < 1; i++) {

        const boardPath = `../Networks/${network[i].name}/${network[i].name}PlayersBoard.json`;
        const filteredDataPath = `../Networks/${network[i].name}/filtered${network[i].name}Data.json`;

        const filteredDataJson = fs.readFileSync(filteredDataPath);
        const filteredData = JSON.parse(filteredDataJson);

        const generatePlayersBoard = (data) => {

            const totalNumberOfEthernautLevels = 27;
            let allPlayers = [];

            const calculateTotalTimeTakenToCompleteLevels = (levelsArray) => {
                totalTimeTaken = 0;
                inputArray = levelsArray;
                inputArray.forEach(level => {
                    if (level.timeCreated !== "this is a solved level" && level.isCompleted == true) totalTimeTaken += level.timeTaken;
                });
                return totalTimeTaken;
            }

            const calculateTotalNumberOfLevelsCompleted = (levelsArray) => {
                let totalNumberCompleted = 0;
                levelsArray.forEach(level => {
                    if (level.timeCreated !== "this is a solved level" && level.isCompleted == true) totalNumberCompleted++;
                });
                return totalNumberCompleted;
            }

            const calculatePlayerScore = (levelsArray) => {
                let numberCompleted = calculateTotalNumberOfLevelsCompleted(levelsArray);
                let timeTaken = calculateTotalTimeTakenToCompleteLevels(levelsArray);
                let rawScore = (0.9 * numberCompleted / totalNumberOfEthernautLevels) + (12 * numberCompleted / timeTaken);
                let result = 100 * rawScore;
                return result;
            }

            for (profile of data) {

                // if (profile.totalNumberOfLevelsCompleted > 0) {
                    try {
                        let playerProfile = {
                            player: profile.player,
                            totalTimeTakenToCompleteLevels: calculateTotalTimeTakenToCompleteLevels(profile.levels),
                            totalNumberOfLevelsCompleted: calculateTotalNumberOfLevelsCompleted(profile.levels),
                            playerScore: calculatePlayerScore(profile.levels) ? calculatePlayerScore(profile.levels) : 0,
                            alias: ""
                        };
                        allPlayers.push(playerProfile);
                        console.log(playerProfile);
                    } catch (error) { }

                // }
            }

            fs.writeFileSync(boardPath, JSON.stringify(allPlayers));
            console.log(`we came, we saw, we processed! player profiles written to the local ${network[i].name} players board`)
        };


        generatePlayersBoard(filteredData);

    }
};

processFilteredDataToNetworkBoards();

// const boardPath = "./goerliPlayersBoard.json";
// const filteredDataPath = "./filteredData.json";

// const filteredDataJson = fs.readFileSync(filteredDataPath);
// const filteredData = JSON.parse(filteredDataJson);

// const generatePlayersBoard = (data) => {

//     const totalNumberOfEthernautLevels = 27;
//     let allPlayers = [];

//     const calculateTotalTimeTakenToCompleteLevels = (levelsArray) => {
//         totalTimeTaken = 0;
//         inputArray = levelsArray;
//         inputArray.forEach(level => {
//             if (level.timeCreated !== "this is a solved level" && level.isCompleted == true) totalTimeTaken += level.timeTaken;
//         });
//         return totalTimeTaken;
//     }

//     const calculateTotalNumberOfLevelsCompleted = (levelsArray) => {
//         let totalNumberCompleted = 0;
//         levelsArray.forEach(level => {
//             if (level.timeCreated !== "this is a solved level" && level.isCompleted == true) totalNumberCompleted++;
//         });
//         return totalNumberCompleted;
//     }

//     const calculatePlayerScore = (levelsArray) => {
//         let numberCompleted = calculateTotalNumberOfLevelsCompleted(levelsArray);
//         let timeTaken = calculateTotalTimeTakenToCompleteLevels(levelsArray);
//         let rawScore = (0.9 * numberCompleted / totalNumberOfEthernautLevels) + (/*if you think theres a minimum time its going to take to complete a level, add it here...*/numberCompleted / timeTaken);
//         let result = 100 * rawScore;
//         return result;
//     }

//     for (profile of data) {

//         try {
//             let playerProfile = {
//                 player: profile.player,
//                 totalTimeTakenToCompleteLevels: calculateTotalTimeTakenToCompleteLevels(profile.levels),
//                 totalNumberOfLevelsCompleted: calculateTotalNumberOfLevelsCompleted(profile.levels),
//                 playerScore: calculatePlayerScore(profile.levels) ? calculatePlayerScore(profile.levels) : 0,
//                 alias: ""
//             };
//             allPlayers.push(playerProfile);
//             console.log(playerProfile);
//         } catch (error) { }
//     }

//    fs.writeFileSync(boardPath, JSON.stringify(allPlayers));
//    console.log("we came, we saw, we processed! files written to the local all players board")
// };


// generatePlayersBoard(filteredData);