const fs = require("fs");

const dataPath = "./lastDataDrop.json";

const orderLeaderBoard = () => {
    let entries = fs.readFileSync(dataPath);

    for (attempt of entries) {
        attempts.sort((a, b) => {
            return b.playerScore - a.playerScore;
        });
    }
}

orderLeaderBoard();