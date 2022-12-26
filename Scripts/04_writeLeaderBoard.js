const fs = require("fs");

const allPlayersPath = "../allPlayersBoard.json";
const leaderBoardPath = "../Boards/leaderBoard.json";

const allPlayersBoardJson = fs.readFileSync(allPlayersPath);
const allPlayersBoard = JSON.parse(allPlayersBoardJson);

const readPlayersBoardAndWriteToLeaderBoard = (unorderedBoard) => {

    let input = unorderedBoard;
    let leaderBoard = [];

    // for (entry of input) {
        input.sort((a, b) => {
            return b.playerScore - a.playerScore;
        });
    //}
    leaderBoard = input;

    fs.writeFileSync(leaderBoardPath, JSON.stringify(leaderBoard));
    console.log("button up your mittens, because the leaders have come forth! Leader board written from historical data.")
}

readPlayersBoardAndWriteToLeaderBoard(allPlayersBoard);