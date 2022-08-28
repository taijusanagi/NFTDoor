/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { network } = require("hardhat");
const { expect } = require("chai");
const hre = require("hardhat");

/*
 * @dev: should use mumbai specific setting for chainlink integration
 *       https://docs.chain.link/docs/vrf/v2/supported-networks/#polygon-matic-mumbai-testnet
 */

describe("NFTDoor", function () {
  let nftDoorContract, mockVRFCoordinatorV2, owner, other;
  const name = "NFTDoor";
  const symbol = "NDR";
  const baseTokenURI = "http://localhost:3000/";
  const mintLimit = 10;
  const mintPrice = 1;

  const subscriptionId = 1610;
  const keyHash = "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f"; //
  const callbackGasLimit = 1000000;
  const requestConfirmations = 3;

  beforeEach(async function () {
    const NFTDoor = await hre.ethers.getContractFactory("NFTDoor");
    const MockVRFCoordinatorV2 = await hre.ethers.getContractFactory("MockVRFCoordinatorV2");

    /*
     * @dev: if target network is mumbai, using mumbai coordinator for integration test
     *       if target network is other than mumbai, mock coordinator to unit test
     */
    if (network.name === "mumbai") {
      const coordinatorAddress = "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed";
      mockVRFCoordinatorV2 = await MockVRFCoordinatorV2.attach(coordinatorAddress);
    } else {
      mockVRFCoordinatorV2 = await MockVRFCoordinatorV2.deploy();
    }

    [owner, other, ...addrs] = await hre.ethers.getSigners();
    nftDoorContract = await NFTDoor.deploy(
      mockVRFCoordinatorV2.address,
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

    if (network.name === "mumbai") {
      await mockVRFCoordinatorV2.addConsumer(subscriptionId, nftDoorContract.address);
    }
  });

  it("Deployed", async function () {
    expect(await nftDoorContract.name()).to.equal(name);
    expect(await nftDoorContract.symbol()).to.equal(symbol);
    expect(await nftDoorContract.s_subscriptionId()).to.be.equal(subscriptionId);
    expect(await nftDoorContract.COORDINATOR()).to.be.equal(mockVRFCoordinatorV2.address);
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
        await nftDoorContract.requestRandomWords(owner.address, 1, { value: mintPrice });
      });
    });
  } else {
    describe("requestRandomWords", function () {
      it("Should sent a request to a random word", async function () {
        await expect(nftDoorContract.requestRandomWords(owner.address, 1, { value: mintPrice })).to.emit(
          mockVRFCoordinatorV2,
          "Called"
        );
      });
    });
  }
});
