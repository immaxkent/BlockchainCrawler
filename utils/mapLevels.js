const fs = require("fs");
const gameData = require("./ethernautLevels.json");
const networks = require("../utils/networkDetails.json");

const createDifficultyMaps = () => {
  for (network of networks) {
    const difficultyMapPath = `../Networks/${network.name}/difficultyMap${network.name}.json`;
    const difficultyMap = mapLevels(network);
    fs.writeFileSync(difficultyMapPath, JSON.stringify(difficultyMap));
  }
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

  levelsAddressObject = require(`../Networks/${network.name}/levelsObject.json`);

  const levelsData = nameData.map((level, index) => {
    return {
      ...level,
      address: levelsAddressObject[index],
    };
  });

  console.log(levelsData);

  return levelsData;
};

createDifficultyMaps();
