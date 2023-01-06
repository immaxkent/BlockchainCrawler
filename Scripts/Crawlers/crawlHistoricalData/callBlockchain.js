const { evaluateIfWeHavePassedReDeployment } = require("./evaluateHelper.js");

const callBlockChain = async (
  network,
  nodeProvider,
  fromBlock,
  toBlock,
  switchoverBlock,
  log
) => {
  let logs = [];
  const incrementer = 2000;

  const upperBlock = toBlock;
  let lastFromBlock = fromBlock; //the first deployed Ethernaut block
  let nextToBlock = fromBlock + incrementer; //plus difference 3605, then 10,000 thereafter until 7968901

  do {
    if (lastFromBlock < switchoverBlock && nextToBlock > switchoverBlock) {
      nextToBlock = switchoverBlock;
    }

    console.log("lastFromBlock", lastFromBlock);
    console.log("nextToBlock", nextToBlock);
    const address = !evaluateIfWeHavePassedReDeployment(
      lastFromBlock,
      switchoverBlock
    )
      ? network.oldAddress
      : network.newAddress;

    const logDump = await nodeProvider.getLogs({
      fromBlock: lastFromBlock,
      toBlock: nextToBlock,
      address,
      topics: [],
    });

    console.log("found", logDump.length, "logs");
    logs = logs.concat(logDump);

    lastFromBlock = nextToBlock + 1;

    nextToBlock =
      nextToBlock + incrementer + 1 > upperBlock
        ? upperBlock
        : nextToBlock + incrementer + 1;
  } while (lastFromBlock < upperBlock);

  console.log("returning logs", logs.length);
  return logs;
};

module.exports = callBlockChain;
