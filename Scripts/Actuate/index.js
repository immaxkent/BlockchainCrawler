const refreshEthernautBasedData = require("./refreshEthernautBasedData.js");
const fetchNewDataAndUpdatePlayersBoard = require("../Crawlers/crawlNewData/index.js");
const writeLeaderBoard = require("./writeLeaderBoard.js");
const { reCalculateScores } = require("../Tools/evaluateHelper");
const consoleCustomiser = require("../../utils/consoleCustomiser");
const { logger } = consoleCustomiser({ delay: 50, randomized: true });

const trigger = () => {

  refreshEthernautBasedData();

  fetchNewDataAndUpdatePlayersBoard();

  writeLeaderBoard(logger, reCalculateScores);
  /*
   * the reCalculateScores implementation at this level is needless.
   * it has been placed here for ease of access when inspecting/modifying
  */

};

trigger();
