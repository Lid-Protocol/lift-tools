const { ethers } = require("hardhat")
const loadJsonFile = require('load-json-file');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const addresses = loadJsonFile.sync("./scripts/addresses.json").networks.ropsten;

async function main() {
  try {
      const whitelistingTool = await ethers.getContractAt("WhitelistingTool", addresses.WhitelistingTool);
      const liftToken = await ethers.getContractAt("ERC20Blacklist", addresses.LiftToken);

      console.log("Calling getWhitelistedAddrs...");
      const addrs = await whitelistingTool.getWhitelistedAddrs();

      console.log("Writing CSV file...");
      const ws = fs.createWriteStream(path.resolve(__dirname, 'csv', 'export.csv'));
      const csvStream = csv.format({ headers: true });
      csvStream.pipe(ws).on('end', () => process.exit(0));
      
      await Promise.all(addrs.map(async (addr) => {
        const balance = ((await liftToken.balanceOf(addr)) / (10**18)).toFixed(3).toString();
        csvStream.write({ "Address": addr, "LIFT Balance": balance });
      }));
      csvStream.end();
    } catch(err) {
      console.error(err);
      process.exit(1);
    }
}
  
main();
  