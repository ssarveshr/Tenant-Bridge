require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.APP_WALLET_PRIVATE_KEY ? [process.env.APP_WALLET_PRIVATE_KEY] : []
    }
  },
  etherscan: {
    // V2 style configuration: just the key as a single string
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  // To hide the Sourcify notice and errors
  sourcify: {
    enabled: false
  }
};
