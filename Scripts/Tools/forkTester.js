const fs = require("fs");
const Web3 = require("web3");
const web3 = new (Web3);

const forkDataJson = fs.readFileSync("./forkData.json");
const forkData = JSON.parse(forkDataJson);
const forkDataArray = [];

forkData.forEach(log => {

    const topics1Array = [
         { type: "address", name: "player" },       
    ];
    const topics2Array = [
        { type: "uint256", name: "time" },       
    ];
    const topics3Array = [
    { type: "uint256", name: "volume" },       
    ];

    const topic1Array = web3.eth.abi.decodeParameters(topics1Array, String(log.topics[1])); 
    const topic2Array = web3.eth.abi.decodeParameters(topics2Array, String(log.topics[2]));
    const topic3Array = web3.eth.abi.decodeParameters(topics3Array, String(log.topics[3]));


    try{
        let playerProfile = {
            player: topic1Array.player,
            timeTakenGlobal: topic2Array.time,
            totalCompletedGlobal: topic3Array.volume
        }

        forkDataArray.push(playerProfile);
        console.log(playerProfile);


    } catch (error) {console.log(error)}
})