const { ethers, upgrades } = require("hardhat")

async function main() {

    //Silences "struct" warnings
    //WARNING: do NOT add new properties, structs, mappings etc to these contracts in upgrades.
    upgrades.silenceWarnings()

    // We get the contract to deploy
    const WhitelistingTool = await ethers.getContractFactory("WhitelistingTool")

    console.log("Starting deployment...")

    const whitelistingTool = await upgrades.deployProxy(WhitelistingTool, [], {unsafeAllowCustomTypes: true})
    await whitelistingTool.deployed()
    console.log("whitelistingTool deployed to:", whitelistingTool.address)
}
  
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  });
  