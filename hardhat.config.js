require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    moonbase: {
      url: process.env.MOONBASE_URL || "https://rpc.api.moonbase.moonbeam.network",
      chainId: 1287, // Moonbase Alpha TestNet Chain ID
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gas: 5000000,
      gasPrice: 1000000000,
    },
    hardhat: {
      // Local development network
    }
  },
  paths: {
    sources: "./contracts/src",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  etherscan: {
    apiKey: {
      moonbaseAlpha: "no-api-key-needed", // No API key needed for Moonbase Alpha
    },
  },
};
