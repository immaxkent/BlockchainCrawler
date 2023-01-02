const filterLogs = require("./filterLogs.js");
const mockBlockLogs = require("./mockData/blockchainLogs.json");

describe("filtering logs", () => {
  const filteredLogs = filterLogs(mockBlockLogs);
  it("should return the same amount of logs as input", () => {
    expect(filteredLogs.length).toEqual(25);
  });

  describe("each log", () => {
    it("should include the player string", () => {
      expect(filteredLogs[0].player).toEqual(mockBlockLogs[0].player);
    });
  });
});
