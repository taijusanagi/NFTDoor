import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
    return;
  }
  const { contractAddress, tokenId } = req.query;
  console.log(contractAddress, tokenId);

  //TODO: add rarity calculation
  //TODO: use registered content

  const metadata = {
    name: "name",
    desctiption: "desctiption",
    image: "image",
  };

  res.status(200).json(metadata);
}
