export interface Content {
  percentage: number;
  image: string;
  video: string;
  videDelayTime: number;
}

export interface DynamicNFT {
  creator: string;
  contractAddress: string;
  name: string;
  symbol: string;
  logo: string;
  totalSupply: string;
  priceInWei: string;
  contents: Content[];
  tokenIdToRandomNumber?: {
    [key: string]: string;
  };
}
