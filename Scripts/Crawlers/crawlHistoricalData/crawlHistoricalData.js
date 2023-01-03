const createLeaderBoard = () => {
  let network = networkData;
  let currentNetwork = network[i].networkDecleration.split(".")[1];
  const settings = {
    apiKey: `${network[i].API_Key}`,
    network: currentNetwork,
  };
  const filteredDataPath = `../Networks/${network[i].name}/filtered${network[i].name}Data.json`;
  const alchemy = new Alchemy(settings);
  const infuraWeb3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://sepolia.infura.io/v3/eae969da77634e23bef9256f6d66e2f6"
    )
  );
  const web3 = new Web3();

  retreiveAndWrite();
};
