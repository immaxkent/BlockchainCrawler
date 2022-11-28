
const fs = require("fs");
const { Network, Alchemy, Utils } = require("alchemy-sdk");

const apiKey = "<DROP_YOUR_API_KEY_HERE>";
const settings = {
  apiKey: apiKey,
  network: Network.ETH_GOERLI, //or whichever network you want to use
};

const dataPath = "./lastDataDrop.json";

const alchemy = new Alchemy(settings);

const retreiveData = async () => {
  /*
  you don't need to do just getLogs - you can use a plethora of calls from alchemy. 
  See the docs and more here https://docs.alchemy.com/
  */
  let logs = await alchemy.core.getLogs({
    fromBlock: "latest",
    toBlock: "pending",
    address: "vitalik.eth",
    topics: [
        //list your topics here
    ]
    });

const dataDrop = [];

    for (log of logs) {
        let txn = await alchemy.core.getTransaction(log.transactionHash);
        let block = await alchemy.core.getBlock(log.blockNumber);
        try {
             let data = {
                from: String(txn.from),
                timeStamp: Number(block.timestamp)
                /*
                write your desired data derivations here
                */
             };
             dataDrop.push(data);
        } catch (error) {
            console.log(error);
        }
    }
    fs.writeFileSync(dataPath, JSON.stringify(dataDrop));
    console.log(logs);
};

const retreiveAndWrite = async () => {
  try {
    await retreiveData();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

/*
once your desired data is held in our JSON array dataDrop, 
you can do whatever you want with it. We call retreiveAndWrite() 
to write this data into the file specified in dataPath.
*/
retreiveAndWrite();


