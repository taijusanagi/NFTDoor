import { ethers } from "ethers";
import { Contract, Provider } from "ethers-multicall";
import type { NextApiRequest, NextApiResponse } from "next";

import { rpc } from "../../../lib/contracts/config";
import NFTDoorArtifact from "../../../lib/contracts/NFTDoor.json";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
    return;
  }
  const { contractAddress } = req.query;
  if (!contractAddress || typeof contractAddress !== "string") {
    res.status(400).end("Invalid argument");
    return;
  }
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const contract = new ethers.Contract(contractAddress, NFTDoorArtifact.abi, provider);
  const multicallProvider = new Provider(provider);
  await multicallProvider.init();
  const mulcicallContract = new Contract(contractAddress, NFTDoorArtifact.abi);
  let tokenIds = [];
  const totalSupply = await contract.totalSupply();
  const tokenByIndexMulcicalls: any[] = [];
  for (let i = 0; i < totalSupply; i++) {
    tokenByIndexMulcicalls.push(mulcicallContract.tokenByIndex(i));
  }
  const tokenByIndexResult = await multicallProvider.all(tokenByIndexMulcicalls);
  tokenIds = tokenByIndexResult;
  const metadata = {
    tokenIds,
  };
  res.status(200).json(metadata);
}
