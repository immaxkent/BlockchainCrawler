const fs = require("fs");
const networks = require("./networkDetails.json");

const mapDifficultyToNetworkPlayersBoards = () => {

    for (network of networks) {
        const filteredData = require(`../../Networks/${network.name}/filtered${network.name}Data.json`);
        const playersBoard = require(`../../Networks/${network.name}/${network.name}PlayersBoard.json`);
        const difficultyMap = require(`../../Networks/${network.name}/difficultyMap${network.name}.json`);

        


    }

}

mapDifficultyToNetworkPlayersBoards();