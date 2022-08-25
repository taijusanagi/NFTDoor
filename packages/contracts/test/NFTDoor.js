/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("NFTDoor", function () {
  let nftDoor;

  const subscriptionId = 0;
  const name = "name";
  const symbol = "symbol";
  const baseTokenURI = "http://localhost:3000/";
  const mintLimit = 10;
  const mintPrice = 1;

  beforeEach(async () => {
    const NFTDoor = await ethers.getContractFactory("NFTDoor");
    nftDoor = await NFTDoor.deploy(subscriptionId, name, symbol, baseTokenURI, mintLimit, mintPrice);
  });
  it("Deployed", async function () {
    expect(await nftDoor.name()).to.equal(name);
    expect(await nftDoor.symbol()).to.equal(symbol);
  });
});
