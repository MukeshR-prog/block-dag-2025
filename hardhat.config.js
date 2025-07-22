require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // BlockDAG Primordial Testnet
    blockdag_primordial: {
      url: process.env.BLOCKDAG_TESTNET_RPC || "https://rpc.primordial.bdagscan.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1043, // Updated BlockDAG testnet chain ID
      gasPrice: "auto",
      gas: "auto"
    },
    // Local development network
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    // Hardhat network for testing
    hardhat: {
      chainId: 31337,
      accounts: {
        count: 10,
        accountsBalance: "10000000000000000000000" // 10000 ETH
      }
    }
  },
  etherscan: {
    // Add BlockDAG block explorer API key when available
    apiKey: {
      blockdag_primordial: process.env.BLOCKDAG_API_KEY || "your-api-key-here"
    },
    customChains: [
      {
        network: "blockdag_primordial",
        chainId: 1043,
        urls: {
          apiURL: "https://primordial.bdagscan.com/api",
          browserURL: "https://primordial.bdagscan.com"
        }
      }
    ]
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD"
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};
