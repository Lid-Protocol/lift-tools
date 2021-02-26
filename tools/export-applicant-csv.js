const { ethers } = require("hardhat")
const loadJsonFile = require('load-json-file');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const addresses = loadJsonFile.sync("./scripts/addresses.json").networks.mainnet;
const settings = loadJsonFile.sync("./scripts/settings.json").networks.mainnet

async function main() {
  const addrs = [];
  fs.createReadStream(path.resolve(__dirname, 'csv', 'applicants.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => addrs.push(row.Address))
    .on('end', async (rowCount) => {
      console.log(`Parsed ${rowCount} rows`);
      try {
        const whitelistingTool = await ethers.getContractAt("WhitelistingTool", addresses.WhitelistingTool);
        const liftToken = await ethers.getContractAt("ERC20Blacklist", addresses.LiftToken);

        console.log("Writing CSV file...");
        const ws = fs.createWriteStream(path.resolve(__dirname, 'csv', 'export-applicants.csv'));
        const csvStream = csv.format({ headers: true });
        csvStream.pipe(ws).on('end', () => process.exit(0));
        
        await Promise.all(addrs.map(async (addr) => {
          console.log(addr)
          const balance = ((await liftToken.balanceOf(addr)) / (10**18)).toFixed(3).toString();
          csvStream.write({ "Address": addr, "LIFT Balance": balance });
        }));
        csvStream.end();
      } catch(err) {
        console.error(err);
        process.exit(1);
      }
  });
}
  
main();
  