# blockScraper

A simple trawler for finding, decoding and writing datas from logs on any Ethereum chain.

Completed using Alchemy. 

To use, run 

`npm init`

and then 

`npm install alchemy-sdk`

&

`npm install alch/alchemy-web3`

& 

`npm install web3`

# Generic Scraper Configuration

Fork, clone and branch onto the genericScraper branch.

Alchemy has a load of built in calls which you can use to retreive whichever data you are after. Most people are fussed about tx receipts, value sent etc... but there is a plethora of options. Check out https://docs.alchemy.com/ for more details.

Essentially, once you have written your returned logs/datas from the ABI into your JSON, it is up to you to sort and play with the process.js file to deposit your data in a way the front end can digest it.

# Ethernaut

`scraper.js` is designed to retreive and sort historical data into the leader board structure

`crawler.js` is designed to retreive and write data seen in the event emits of `StatisticsV2.sol` of this branch <PASTE-BRANCH-URL-HERE>