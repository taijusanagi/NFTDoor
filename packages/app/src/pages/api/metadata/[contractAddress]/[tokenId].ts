import { ethers } from "ethers";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

import { NFTDoor_ABI } from "../../../../lib/contracts/NFTDoor";
import { firestore, tableName } from "../../../../lib/firebase";
import { DynamicNFT } from "../../../../type/dynamic-nft";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).end("method not allowed");
    return;
  }
  const { contractAddress, tokenId } = req.query;
  if (typeof contractAddress !== "string" || typeof tokenId !== "string") {
    res.status(400).end("invalid argument");
    return;
  }

  const docRef = doc(firestore, tableName, contractAddress);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    res.status(404).end("not found");
    return;
  }
  const docData = docSnap.data() as DynamicNFT;

  let randomNumber;
  if (!docData.tokenIdToRandomNumber?.[tokenId]) {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/b4EX5QswzzC4XN0hj2KHxQMHNXQqvA7T"
    );
    const contract = new ethers.Contract(contractAddress, NFTDoor_ABI, provider);
    const randomNumer = await contract.tokenIdToRandomNumber(tokenId);
    if (ethers.BigNumber.from(randomNumer).eq(0)) {
      res.status(400).end("token is not minted");
      return;
    }
    //FIXME: this may cause conflict
    const tokenIdToRandomNumber = docData.tokenIdToRandomNumber;
    tokenIdToRandomNumber[tokenId] = randomNumer.toString();
    await updateDoc(docRef, {
      tokenIdToRandomNumber,
    });
  } else {
    randomNumber = docData.tokenIdToRandomNumber[tokenId];
  }
  let calculate = 0;
  let image;
  let video;
  let delayTime;
  for (const content of docData.contents) {
    calculate = calculate + content.percentage;
    if (ethers.BigNumber.from(randomNumber).mod(100).lte(content.percentage)) {
      image = content.image;
      video = content.video;
      delayTime = content.videDelayTime;
      break;
    }
  }
  const metadata = {
    name: docData.name,
    desctiption: "NFTDoor dynamic NFTs with Chainlink VRF V2",
    image,
    video,
    delayTime,
  };
  res.status(200).json(metadata);
}
