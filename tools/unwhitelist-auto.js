const { ethers } = require("hardhat")
const loadJsonFile = require('load-json-file');
const addresses = loadJsonFile.sync("./scripts/addresses.json").networks.ropsten;
const settings = loadJsonFile.sync("./scripts/settings.json").networks.ropsten

async function main() {
  try {
    const whitelistingTool = await ethers.getContractAt("WhitelistingTool", addresses.WhitelistingTool);
    const liftToken = await ethers.getContractAt("ERC20Blacklist", addresses.LiftToken);

    console.log("Calling getWhitelistedAddrs...");
    let addrs = await whitelistingTool.getWhitelistedAddrs();

    console.log("Retriving low balance addresses...");
    addrs = await Promise.all(addrs.map(async (addr) => {
      const balance = ((await liftToken.balanceOf(addr)) / (10**18)).toFixed(3);
      if (balance < settings.minBalance) return addr
      return ""
    }));
    
    console.log("Calling unwhitelistAll...");
    await whitelistingTool.unwhitelistAll(addrs.filter(addr => addr));

    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}
  
main();
  