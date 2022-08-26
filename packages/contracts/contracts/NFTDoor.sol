//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

//TODO: make this re-usable. we allow uesr to create register new dynamic NFT as launchpad.
//TODO: We need to handle metadata request from each contract
contract NFTDoor is Ownable, VRFConsumerBaseV2, ERC721 {
  struct MintInfo {
    address to;
    uint256 tokenId;
  }

  event BaseTokenURISet(string baseTokenURI);
  event Minted(uint256 indexed tokenId, uint256 randomNumber);

  mapping(uint256 => MintInfo[]) public requestIdToMintInfos;
  mapping(uint256 => uint256) public tokenIdToRandomNumber;

  VRFCoordinatorV2Interface COORDINATOR;
  uint64 s_subscriptionId;
  address vrfCoordinator = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed; //mumbai
  bytes32 keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;//mumbai
  uint32 callbackGasLimit = 100000;
  uint16 requestConfirmations = 3;

  string private _baseTokenURI;

  uint256 public totalSupply;
  uint256 public mintLimit;
  uint256 public mintPrice;

  constructor(
    uint64 subscriptionId,
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint256 _mintLimit,
    uint256 _mintPrice
  ) VRFConsumerBaseV2(vrfCoordinator) ERC721(name, symbol) {
    COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
    s_subscriptionId = subscriptionId;
    mintLimit = _mintLimit;
    mintPrice = _mintPrice;

    setBaseTokenURI(baseTokenURI);
  }

  function setBaseTokenURI(string memory baseTokenURI) public payable onlyOwner {
    _baseTokenURI = baseTokenURI;
    emit BaseTokenURISet(baseTokenURI);
  }

  function withdraw(address _recepient) public payable onlyOwner {
    payable(_recepient).transfer(address(this).balance);
  }

  function requestRandomWords(address to, uint32 amount) public payable {
    require(totalSupply + amount <= mintLimit, "NFTDoor: mint limit exceeded");
    uint256 requestId = COORDINATOR.requestRandomWords(
      keyHash,
      s_subscriptionId,
      requestConfirmations,
      callbackGasLimit,
      amount
    );
    for (uint256 i = 0; i < amount; i++) {
      uint256 tokenId = totalSupply + i + 1;
      MintInfo memory mintInfo = MintInfo({to: to, tokenId: tokenId});
      requestIdToMintInfos[requestId].push(mintInfo);
    }
    totalSupply = totalSupply + amount;
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
    MintInfo[] memory mintInfos = requestIdToMintInfos[requestId];
    for (uint256 i = 0; i < mintInfos.length; i++) {
      MintInfo memory mintInfo = mintInfos[i];
      _mint(mintInfo.to, mintInfo.tokenId);
      tokenIdToRandomNumber[mintInfo.tokenId] = randomWords[i];
      emit Minted(mintInfo.tokenId, randomWords[i]);
    }
  }

  //TODO: We should have contract address in base uri
  function _baseURI() internal view override returns (string memory) {
    return _baseTokenURI;
  }
}
