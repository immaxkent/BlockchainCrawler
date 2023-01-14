const refreshEthernautBasedData = require("./refreshEthernautBasedData.js");
const crawlForFreshEntriesAndUpdatePlayersBoard = require("../Crawlers/crawlNewData/index.js");
const writeLeaderBoard = require("./writeLeaderBoard.js");
const { reCalculateScores } = require("../Tools/evaluateHelper");
const consoleCustomiser = require("../../utils/consoleCustomiser");
const { logger } = consoleCustomiser({ delay: 50, randomized: true });

const trigger = () => {

  refreshEthernautBasedData();
  /**levelsObject.json
   * ethernautLevels.json
   */

  crawlForFreshEntriesAndUpdatePlayersBoard();

  writeLeaderBoard(logger, reCalculateScores);
  /*
   * the reCalculateScores implementation at this level is needless.
   * it has been placed here for ease of access when inspecting/modifying
  */

};

trigger();
