const fs = require("fs");

const boardPath = "./GoerliPlayersBoard.json";
const filteredDataPath = "./filteredData.json";

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
        let rawScore = (0.9 * numberCompleted / totalNumberOfEthernautLevels) + (/*if you think theres a minimum time its going to take to complete a level, add it here...*/numberCompleted / timeTaken);
        let result = 100 * rawScore;
        return result;
    }

    for (profile of data) {

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
    }

   fs.writeFileSync(boardPath, JSON.stringify(allPlayers));
   console.log("we came, we saw, we processed! files written to the local all players board")
};


generatePlayersBoard(filteredData);