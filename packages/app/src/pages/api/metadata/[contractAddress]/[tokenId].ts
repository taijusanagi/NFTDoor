import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

import { NFTDoor_ABI } from "../../../../lib/contracts/NFTDoor";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
    return;
  }
  const { contractAddress, tokenId } = req.query;
  if (!contractAddress || typeof contractAddress !== "string" || !tokenId || typeof tokenId !== "string") {
    res.status(400).end("Invalid argument");
    return;
  }

  const isCached = false;
  let rarity;
  if (!isCached) {
    //TODO update provider uri
    const provider = new ethers.providers.JsonRpcProvider("");
    const contract = new ethers.Contract(contractAddress, NFTDoor_ABI, provider);
    /*
     * @dev random number is null when tokenId not minted
     */
    const rondomNumer = await contract.tokenIdToRandomNumber(tokenId);
    //TODO I think this is bignumber so this should be check the value is zero or not in bignumber way
    if (!rondomNumer) {
      res.status(400).end("Token is not minted yet");
      return;
    }
    //TODO: add rarity calculation
    rarity = 0;

    //TODO: save rarity in database for better performance later
  } else {
    //TODO; get data from database
    rarity = 0;
  }

  //TODO: use registered content and aquired rarity
  const metadata = {
    name: "name",
    desctiption: "desctiption",
    image: "image",
  };

  res.status(200).json(metadata);
}
