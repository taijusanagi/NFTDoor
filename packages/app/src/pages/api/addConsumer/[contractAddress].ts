import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

import { consumer, rpc, subscription } from "../../../lib/contracts/config";
import VRFCoordinatorV2 from "../../../lib/contracts/MockVRFCoordinatorV2.json";

const privateKey = process.env.RELAYER_PRIVATE_KEY || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("test");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("method not allowed");
    return;
  }
  const { contractAddress } = req.query;
  console.log("contractAddress", contractAddress);
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const signer = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(consumer, VRFCoordinatorV2.abi, signer);
  const tx = await contract.addConsumer(subscription, contractAddress);
  await tx.wait();
  const { hash } = tx;
  res.status(200).json({ hash });
}
