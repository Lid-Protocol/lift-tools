require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-dependency-compiler");

const loadJsonFile = require('load-json-file')
const keys = loadJsonFile.sync("./keys.json")

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${keys.networks.ropsten.infuraKey}`,
      accounts: [keys.networks.ropsten.privateKey],
      gasMultiplier: 1.25
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${keys.networks.mainnet.infuraKey}`,
      accounts: [keys.networks.mainnet.privateKey],
      gasMultiplier: 1.25
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]    
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 200000
  },
  etherscan: {
    apiKey: "DUMQWHVAG4IXE2287UAKE3ZD144YJSZSTI"
  },
  dependencyCompiler: {
    paths: ["@lidprotocol/xlock-contracts/contracts/ERC20/ERC20Blacklist.sol"],
  }
}