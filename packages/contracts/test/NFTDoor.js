/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { network } = require("hardhat");
const { expect } = require("chai");
const hre = require("hardhat");

describe("NFTDoor", function () {
  let nftDoorContract, mockVRFCoordinatorV2, owner, other;
  const name = "NFTDoor";
  const symbol = "NDR";
  const baseTokenURI = "http://localhost:3000/";
  const mintLimit = 10;
  const mintPrice = 1;

  const subscriptionId = 1582;
  const keyHash = "0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61";
  const callbackGasLimit = 100000;
  const requestConfirmations = 3;
  let coordinatorAddress = "";

  beforeEach(async function () {
    const NFTDoor = await hre.ethers.getContractFactory("NFTDoor");

    /*
     * @dev: if target network is mumbai, using mumbai coordinator for integration test
     *       if target network is other than mumbai, mock coordinator to unit test
     */
    if (network.name === "mumbai") {
      coordinatorAddress = "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed";
    } else {
      const MockVRFCoordinatorV2 = await hre.ethers.getContractFactory("MockVRFCoordinatorV2");
      mockVRFCoordinatorV2 = await MockVRFCoordinatorV2.deploy();
      coordinatorAddress = mockVRFCoordinatorV2.address;
    }

    [owner, other, ...addrs] = await hre.ethers.getSigners();
    nftDoorContract = await NFTDoor.deploy(
      coordinatorAddress,
      subscriptionId,
      keyHash,
      callbackGasLimit,
      requestConfirmations,
      name,
      symbol,
      baseTokenURI,
      mintLimit,
      mintPrice
    );
  });

  it("Deployed", async function () {
    expect(await nftDoorContract.name()).to.equal(name);
    expect(await nftDoorContract.symbol()).to.equal(symbol);
    expect(await nftDoorContract.s_subscriptionId()).to.be.equal(subscriptionId);
    expect(await nftDoorContract.COORDINATOR()).to.be.equal(coordinatorAddress);
    expect(await nftDoorContract.keyHash()).to.be.equal(keyHash);
    expect(await nftDoorContract.callbackGasLimit()).to.be.equal(callbackGasLimit);
    expect(await nftDoorContract.requestConfirmations()).to.be.equal(requestConfirmations);
    expect(await nftDoorContract.mintLimit()).to.be.equal(mintLimit);
    expect(await nftDoorContract.mintPrice()).to.be.equal(mintPrice);
  });

  describe("setBaseTokenURI", function () {
    it("should revert if other address than Owner", async function () {
      const baseurl = "ipfs://test.url/";
      await expect(nftDoorContract.connect(other).setBaseTokenURI(baseurl)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("should set the BaseURI by the owner", async function () {
      const baseurl = "ipfs://test.url/";
      await expect(nftDoorContract.connect(owner).setBaseTokenURI(baseurl)).to.emit(nftDoorContract, "BaseTokenURISet");
    });
  });

  describe("withdraw", function () {
    it("should revert if other address than Owner", async function () {
      await expect(nftDoorContract.connect(other).withdraw(other.address)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("should withdraw with the owner", async function () {
      await nftDoorContract.connect(owner).withdraw(owner.address);
    });
  });

  /*
   * @dev: integtation test is only on requestRandomWords for better performance
   */
  if (network.name === "mumbai") {
    describe.only("requestRandomWords", function () {
      it("Should sent a request to a random word", async function () {
        await nftDoorContract.requestRandomWords(owner.address, 1);
      });
    });
  } else {
    describe("requestRandomWords", function () {
      it("Should sent a request to a random word", async function () {
        await expect(nftDoorContract.requestRandomWords(owner.address, 1)).to.emit(mockVRFCoordinatorV2, "Called");
      });
    });
  }
});
