const { ethers } = require("ethers");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config(); // Load environment variables

module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_API_URL, // Alchemy URL from .env
      accounts: [process.env.PRIVATE_KEY], // Private key from .env
    },
  },
};
