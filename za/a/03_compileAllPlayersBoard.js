const fs = require("fs");

// const networkDataJson = fs.readFileSync("../utils/networkDetails.json");
// const networkData = JSON.parse(networkDataJson);

// const compileAllPlayersBoard = () {

//     let network = networkData;

//     for (let i = 0; i < 1; i++) {

//     }
// }

const dataPath = "../allPlayersBoard.json";

const goerliBoardJson = fs.readFileSync("../Networks/Goerli/goerliPlayersBoard.json");
const goerliBoard = JSON.parse(goerliBoardJson);

const writeBoardsToAllPlayersBoard = (board) => {
    
    let allPlayers = [];

    //how can i have multiple inputs here, and read all network boards in one...?

    board.forEach(profile => {
        allPlayers.push(profile);
    });

    fs.writeFileSync(dataPath, JSON.stringify(allPlayers));
    console.log("ohhh this is exciting - we have moved the network boards to the global all players board!")

};

writeBoardsToAllPlayersBoard(goerliBoard);
