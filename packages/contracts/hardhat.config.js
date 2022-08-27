/* eslint-disable @typescript-eslint/no-var-requires */
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv").config();

const accounts = process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.15",
  mocha: {
    timeout: 400000, // updated for tests
  },
  gasReporter: {
    currency: "CHF",
    gasPrice: 21,
  },
  networks: {
    mumbai: {
      chainId: 80001,
      url: "https://polygon-mumbai.g.alchemy.com/v2/vzOwiL7MTT2bjnZozNtemIWyq0zC6oYW",
      accounts,
    },
  },
};
