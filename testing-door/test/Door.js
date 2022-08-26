const { ethers } = require("chai");
const { expect } = require("chai");
const hre = require("hardhat");


describe("NFTDoor", function() {

  let NFTDoor, nftDoorContract, owner, addr1, addr2, addr3, addrs
  const subscriptionId = 1582;
  const name = "NFTDoor";
  const symbol = "NDR";
  const baseTokenURI = "http://localhost:3000/";
  const mintLimit = 10;
  const mintPrice = 1;
  const vrfCoordinator = 0x2eD832Ba664535e5886b75D64C46EB9a228C2610;
  const _keyHash = 0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61;
  const _callbackGasLimit = 100000;
  const _requestConfirmations = 3;

  beforeEach(async function () {
    NFTDoor = await hre.ethers.getContractFactory("NFTDoor");
    MockV2 = await hre.ethers.getContractFactory("MockVRFCoordinator");
    [owner, addr1, addr2, addr3, ...addrs] = await hre.ethers.getSigners();
    nftDoorContract = await NFTDoor.deploy(subscriptionId, name, symbol, baseTokenURI, mintLimit, mintPrice);
    mockv2 = await MockV2.deploy();
  });


  it("Deployed", async function () {
    expect(await nftDoorContract.name()).to.equal(name);
    expect(await nftDoorContract.symbol()).to.equal(symbol);
    sub = await nftDoorContract.s_subscriptionId();
    const expected = hre.ethers.utils.parseUnits("1582", 0);
    expect(hre.ethers.utils.formatEther(sub)).to.be.equal(hre.ethers.utils.formatEther(expected))
    mintL = await nftDoorContract._mintLimit();
    const expected2 = hre.ethers.utils.parseUnits("10", 0);
    expect(hre.ethers.utils.formatEther(mintL)).to.be.equal(hre.ethers.utils.formatEther(expected2))
    mintP = await nftDoorContract._mintPrice();
    const expected3 = hre.ethers.utils.parseUnits("1", 0);
    expect(hre.ethers.utils.formatEther(mintP)).to.be.equal(hre.ethers.utils.formatEther(expected3))
  });

  it("Should set the subscriptionId", async function (){
    sub = await nftDoorContract.s_subscriptionId();
    const expected = hre.ethers.utils.parseUnits("1582", 0);
    expect(hre.ethers.utils.formatEther(sub)).to.be.equal(hre.ethers.utils.formatEther(expected))
  });

  describe('setBaseTokenURI', function(){
    it("should set the BaseURI by the owner", async function() {

      const baseurl = "ipfs://test.url/"
      await expect (nftDoorContract.connect(addr1).setBaseTokenURI(baseurl)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    })
  });

  describe('setBaseTokenURI', function(){
    it("should set the BaseURI by the owner", async function() {

      const baseurl = "ipfs://test.url/"
      await expect (nftDoorContract.connect(addr1).setBaseTokenURI(baseurl)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    })
  });



  describe('withdraw', function() {
    it("should revert if other address than Owner", async function() {
      await expect (nftDoorContract.connect(addr1).withdraw(addr2.address)).to.be.revertedWith(
        "Ownable: caller is not the owner")
    });

    it("should withdraw with the owner", async function() {
      await (nftDoorContract.connect(owner).withdraw(addr2.address))
    });

  });

  describe('requestRandomWords', function() {
    it("Should sent a request to a random word", async function() {
      const overrides = {value: hre.ethers.utils.parseEther("0.5")};
      await mockv2.connect(owner).requestRandomWords(_keyHash, subscriptionId, _requestConfirmations, _callbackGasLimit, 100, overrides)
      // await nftDoorContract.connect(addr1).mint(1, overrides)

      // const balanceBeforeWithdraw = hre.ethers.utils.formatEther(
      //   await nftDoorContract.provider.getBalance(owner.address)
      // );

      // await (nftDoorContract.connect(owner).withdraw());
      // const balanceAftereWithdraw = hre.ethers.utils.formatEther(
      //   await nftDoorContract.provider.getBalance(owner.address)
      // );

      // expect(
      //   parseInt(balanceBeforeWithdraw) < parseInt(balanceAftereWithdraw)
      // ).to.be.true

    });

  })


})
