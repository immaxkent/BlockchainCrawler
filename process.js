const fs = require("fs");

const dataPath = "./lastDataDrop.json";

/*
here, write whichever logic you wish to be 
applied to the data held in the dataPath file.
*/

const sortData = () => {
    let entries = fs.readFileSync(dataPath);

    for (attempt of entries) {
        attempts.sort((a, b) => {
            return b.playerScore - a.playerScore;
        });
    }
}

sortData();