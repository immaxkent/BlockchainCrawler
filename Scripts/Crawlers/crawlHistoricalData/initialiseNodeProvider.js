const { Network, Alchemy, Utils } = require("alchemy-sdk");
const Web3 = require("web3");

// const settings = {
//   apiKey: "2A-1DH2kKKB-rNj3Bjgm8yz3clAn6bgp",
//   network: Network.ETH_GOERLI,
// };

const initialiseAlchemy = (network) => {
  console.log("network", network);
  const settings = {
    apiKey: `${network.API_Key}`,
    network: network.networkDecleration.split(".")[1],
  };

  const alchemy = new Alchemy(settings);
  return alchemy.core;
};

const initialiseInfuraForSepolia = () => {
  const infuraWeb3 = new Web3(
    new Web3.providers.HttpProvider("https://sepolia.infura.io/v3/")
  );
  return {
    ...infuraWeb3.eth,
    getLogs: infuraWeb3.eth.getPastLogs,
  };
};

const initialiseNodeProvider = (network) =>
  network.name === "Sepolia"
    ? initialiseInfuraForSepolia()
    : initialiseAlchemy(network);

module.exports = initialiseNodeProvider;
