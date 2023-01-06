const fs = require("fs");
const gameData = require("./ethernautLevels.json");
const networks = require("../utils/networkDetails.json");

const createDifficultyMaps = () => {
  for (network of networks) {
    const difficultyMapPath = `../Networks/${network.name}/difficultyMap${network.name}.json`;
    const archaicNetworkMap = mapLevels(network);
  }

  //fs.writeFileSync(difficultyMapPath, difficultyMap);
};

const mapLevels = (network) => {
  nameData = [];
  gameData.forEach((level) => {
    try {
      let entry = {
        name: level.name,
        difficulty: level.difficulty,
        address: "",
      };
      nameData.push(entry);
    } catch (error) {}
  });

  levelsArray = require(`../../Networks/${network.name}/levelsMapping.json`);

  nameData.forEach((level) => {
    levelsArray.forEach((levelAddress) => {
      if (level.name === levelAddress.name) {
        level.address = levelAddress.address;
      }
    });
  });

  return nameData;
};

createDifficultyMaps();
