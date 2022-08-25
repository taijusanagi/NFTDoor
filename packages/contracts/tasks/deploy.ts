import fs from "fs";
import { task } from "hardhat/config";
import path from "path";

import networks from "../networks.json";
import { isNetwork } from "../types/network";

task("deploy", "deploy").setAction(async (_, { network }) => {
  const { name } = network;
  if (!isNetwork(name)) {
    console.log("network invalid");
    return;
  }
  /*
   * @dev add deployscript and update networks
   */

  fs.writeFileSync(path.join(__dirname, "../networks.json"), JSON.stringify(networks));
  console.log("DONE");
});
