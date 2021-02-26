const { ethers } = require("hardhat")
const loadJsonFile = require('load-json-file');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const addresses = loadJsonFile.sync("./scripts/addresses.json").networks.mainnet;

async function main() {
  const addrs = [];
  fs.createReadStream(path.resolve(__dirname, 'csv', 'whitelist.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => addrs.push(row.Address))
    .on('end', async (rowCount) => {
      console.log(`Parsed ${rowCount} rows`);
      try {
        const whitelistingTool = await ethers.getContractAt("WhitelistingTool", addresses.WhitelistingTool);

        console.log("Calling whitelistAll...");
        await whitelistingTool.whitelistAll(addrs);

        process.exit(0);
      } catch(err) {
        console.error(err);
        process.exit(1);
      }
    });
}
  
main();
  