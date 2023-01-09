const refreshEthernautBasedData = require("./refreshEthernautBasedData.js");
const fetchNewDataAndUpdateLeaderBoard = require("../Crawlers/crawlNewData/index.js");
const trigger = () => {
  /**here, write functions that
   *
   * update gameData.json, levels mappings and totalNumberOfEthernautCalls
   * */

  refreshEthernautBasedData();

  /*
  now, call the newCrawler to update the leaderboard
  */

  fetchNewDataAndUpdateLeaderBoard();

  /**NOTE
   * that the evaluation of player scores shoud be omitted from the current architecture up to and including
   * fetchNewDataAndUpdateLeaderBoard()
   *
   */

  /*
   *
   * also, write a script to re-calculate scores as time goes on
   */

  reCalculateScores();
};

trigger();
