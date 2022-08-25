import { task } from "hardhat/config";

import networks from "../networks.json";
import { isNetwork } from "../types/network";

const ignore = ["faucet"];

task("verify", "verify").setAction(async (_, { network, run }) => {
  const { name } = network;
  if (!isNetwork(name)) {
    console.log("network invalid");
    return;
  }
  const { contracts } = networks[name];
  const promises = Object.entries(contracts)
    .filter(([name]) => !ignore.includes(name))
    .map(([name, address]) => {
      return run("verify:verify", {
        address,
        constructorArguments: [],
      }).catch((e) => {
        console.log(name, e.message);
      });
    });
  await Promise.all(promises);
  console.log("DONE");
});
