const fs = require("fs");

const networkDataJson = fs.readFileSync("../utils/networkDetails.json");
const networkData = JSON.parse(networkDataJson);
const dataPath = "../allPlayersBoard.json";

const compileAllPlayersBoard = () => {

    const network = networkData;
    const lastVersionOfAllPlayersBoardJson = fs.readFileSync(dataPath);
    const lastVersionOfAllPlayersBoard = JSON.parse(lastVersionOfAllPlayersBoardJson);

    for (let i = 0; i < 1; i++) {

        const networkBoardJson = fs.readFileSync(`../Networks/${network[i].name}/${network[i].name}PlayersBoard.json`);
        const networkBoard = JSON.parse(networkBoardJson);
        
        const writeBoardToAllPlayersBoard = (board) => {
            
            let allPlayers = lastVersionOfAllPlayersBoard;
        
            board.forEach(profile => {
                if (profile.totalNumberOfLevelsCompleted >= 0) {

                    allPlayers.push(profile);
                }
            });
        
            fs.writeFileSync(dataPath, JSON.stringify(allPlayers));
            console.log(`ohhh this is exciting - we have moved the ${network[i].name} network board to the global all players board!`)
        
        };
        
        writeBoardToAllPlayersBoard(networkBoard);
        
    }
};

compileAllPlayersBoard();


