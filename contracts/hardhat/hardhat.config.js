require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "blockdag",
  networks: {
    blockdag: {
      url: "https://testnet-rpc.blockdag.network",
      chainId: 1043,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000
    }
  }
};
