# blockScraper

A simple trawler for finding, decoding and writing datas from logs on Ethereum chains running official versions of Open Zeppelin's Ethernaut.

Completed using Alchemy. 

To use, run 

`npm init`

and then 

`npm install alchemy-sdk`

&

`npm install alch/alchemy-web3`

& 

`npm install web3`

# Ethernaut

This code has been uploaded **filled with majestic data points**, but can be ran from scratch if need be. 

Here's how that process would go:

1.  Change the API keys in the file `./utils/networkDetails.json` to include *your API keys* for **Alchemy** and in `01_crawlHistoricalData.js` for **Infura** respectively.

2.  Run `js` scripts under blockScraper/Scripts sequentially, from 01 - 07, to collate all old data from historial **Ethernaut** deployments/networks and write them to the global leader board.

3.  From an automater or action, periodically run Scripts `06_crawlNewEntries.js`, `07_addAliases.js` & `08_reFormatUIBoards.js` to enter new games from the relevant networks, add aliases to the global leader board and generate paginated JSONs for the front end to use.

`crawler.js` is designed to retreive and write data seen in the event emits of `StatisticsV2.sol` of this branch <https://github.com/immaxkent/ethernaut/tree/LeaderBoard>

NB. *Be sure to initialise `allPlayersBoard.json` with an empty array `[]` if starting the scripts from fresh.*

NB. <EXPLAIN-HOW-BLOCK-INTERVALS-ARE-RUN>
# Generic Scraper Configuration

Fork, clone and branch onto the genericScraper branch.

Alchemy has a load of built in calls which you can use to retreive whichever data you are after. Most people are fussed about tx receipts, value sent etc... but there is a plethora of options. Check out https://docs.alchemy.com/ for more details.

Essentially, once you have written your returned logs/datas from the ABI into your JSON, it is up to you to sort and play with the process.js file to deposit your data in a way the front end can digest it.