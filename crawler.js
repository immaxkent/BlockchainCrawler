const fs = require("fs");
const { Network, Alchemy, Utils } = require("alchemy-sdk");

const apiKey = "2A-1DH2kKKB-rNj3Bjgm8yz3clAn6bgp";
const settings = {
  apiKey: apiKey,
  network: Network.ETH_GOERLI,
};

const dataPath = "./historical/1_dataDrop_7535296-7768901.json";

const alchemy = new Alchemy(settings);

InstanceCreatedLog = "0x7bf7f1ed7f75e83b76de0ff139966989aff81cb85aac26469c18978d86aac1c2";
InstanceSubmittedLog = "0x7bf7f1ed7f75e83b76de0ff139966989aff81cb85aac26469c18978d86aac1c2";

const ethernautEventLogs = {
    address: "0xD2e5e0102E55a5234379DD796b8c641cd5996Efd",
    fromBlock: "0x72fac0",
    toBlock: "0x72fea8",
    topics: [InstanceCreatedLog, InstanceSubmittedLog]
};

alchemy.ws.subscribe(ethernautEventLogs, (error, result) => {
    if (error) {
        console.log(error);
    } else {
        console.log(result);
    }
});