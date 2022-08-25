const { ethers } = require("chai");
const { expect } = require("chai");
const hre = require("hardhat");
const { experimentalAddHardhatNetworkMessageTraceHook } = require("hardhat/config");


describe("NFTDoor", function() {

  let NFTDoor, nftDoorContract, owner, addr1, addr2, addr3, addrs
  beforeEach(async function () {
    NFTDoor = await hre.ethers.getContractFactory("NFTDoor");
    [owner, addr1, addr2, addr3, ...addrs] = await hre.ethers.getSigners();
    nftDoorContract = await NFTDoor.deploy(router)
    console.log("deployed to :", nftDoorContract.address)
    //uniswapRouter =  hre.ethers.getContractFactory("IUniswapV2Router02");
  });

  describe('Deployment', function() {
    it('Should deploy', async function () {
    
    })
  });


  describe('Hedger', function() {
    it('Should return the right price feed', async function () {
      const PRICE = await hre.ethers.getContractFactory("PriceConsumerV3");
      const price= await PRICE.deploy();
      await price.deployed();
      console.log('Price deployed to', price.address);
      const VRFConsumerBaseV2ABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
      const vrfCoordinator = "0x2eD832Ba664535e5886b75D64C46EB9a228C2610;" // Coordinator
      const provider = new hre.ethers.providers.JsonRpcProvider("https://rpc.ankr.com/polygon")
      const VFRConsumer = new hre.ethers.Contract(vrfCoordinator, VRFConsumerBaseV2ABI, provider)
      const getPriceUSDT = new hre.ethers.Contract(USDTUSD, VRFConsumerBaseV2ABI, provider)
      await getPriceSAND.latestRoundData()
        .then((roundData) => {
          // Do something with roundData
          let priceInHex = roundData.answer._hex;
          const hexToDecimal = hex => parseInt(hex, 16)
          const price = hexToDecimal(priceInHex)
          console.log(`latest price of SAND: ${price * 10**-8} USD`);
        })

      await getPriceUSDT.latestRoundData()
      .then((roundData) => {
        // Do something with roundData
        let priceInHex = roundData.answer._hex;
        const hexToDecimal = hex => parseInt(hex, 16)
        const price = hexToDecimal(priceInHex)
        console.log(`latest price of USDT: ${price * 10**-8} USD`);
      })

    })

    it('Should transfer USDT to the contract', async function () {
    
    })
  });




})



