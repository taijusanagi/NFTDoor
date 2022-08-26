import { ethers } from "ethers";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

import { NFTDoor_ABI } from "../../../../lib/contracts/NFTDoor";
import { firestore } from "../../../../lib/firebase";

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

  let rarity;

  const docRef = doc(firestore, "gachas", contractAddress);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    res.status(400).end("Contract Address invalid");
    return;
  }

  if (!docSnap.data().tokenIdToRarity?.[tokenId]) {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/b4EX5QswzzC4XN0hj2KHxQMHNXQqvA7T"
    );
    const contract = new ethers.Contract(contractAddress, NFTDoor_ABI, provider);
    /*
     * @dev random number is null when tokenId not minted
     */
    const randomNumer = await contract.tokenIdToRandomNumber(tokenId);
    //TODO I think this is bignumber so this should be check the value is zero or not in bignumber way
    if (!randomNumer) {
      res.status(400).end("Token is not minted yet");
      return;
    }

    if (randomNumer % 100 < docSnap.data().rarityPercentages.common) {
      rarity = "common";
    } else {
      rarity = "rare";
    }

    const tokenIdToRarity = docSnap.data().tokenIdToRarity;
    tokenIdToRarity[tokenId] = rarity;
    await updateDoc(docRef, {
      tokenIdToRarity,
    });
  } else {
    rarity = docSnap.data().tokenIdToRarity[tokenId];
  }

  //TODO: use registered name and description
  const metadata = {
    name: "name",
    desctiption: "desctiption",
    image: docSnap.data().rarityImages[rarity],
    rarity,
  };

  res.status(200).json(metadata);
}
