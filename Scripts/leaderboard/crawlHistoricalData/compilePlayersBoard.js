const fs = require("fs");
const dataPath = "../../../allPlayersBoard.json";

const compileAllPlayersBoard = (networks) => {
  let allPlayers = [];
  for (network of networks) {
    const networkBoardJson = fs.readFileSync(
      `../Networks/${network.name}/${network.name}PlayersBoard.json`
    );
    const networkBoard = JSON.parse(networkBoardJson);
    networkBoard.forEach((profile) => {
      if (profile.totalNumberOfLevelsCompleted >= 0) {
        allPlayers.push(profile);
      }
    });

    console.log(
      `ohhh this is exciting - we have moved the ${network.name} network board to the global all players board!`
    );
  }

  fs.writeFileSync(dataPath, JSON.stringify(allPlayers));
};

module.exports = compileAllPlayersBoard;
