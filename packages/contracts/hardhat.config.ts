import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "./tasks/deploy";
import "./tasks/verify";

import { HardhatUserConfig } from "hardhat/config";

import { accounts, ethersanApiKey, useHardhatFork } from "./lib/env";
import networks from "./networks.json";

const config: HardhatUserConfig = {
  solidity: "0.8.15",
  networks: {
    hardhat: useHardhatFork
      ? {
          forking: {
            url: networks.rinkeby.rpc,
          },
        }
      : {},
    rinkeby: {
      chainId: networks.rinkeby.chainId,
      url: networks.rinkeby.rpc,
      accounts,
    },
  },
  etherscan: {
    apiKey: {
      rinkeby: ethersanApiKey,
    },
  },
};

export default config;
