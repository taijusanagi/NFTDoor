//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

contract NFTDoor is Ownable, VRFConsumerBaseV2, ERC721Enumerable {
  struct MintInfo {
    address to;
    uint256 tokenId;
  }

  event BaseTokenURISet(string baseTokenURI);
  event Requested(uint256 indexed tokenId);
  event Minted(uint256 indexed tokenId, uint256 randomNumber);

  mapping(uint256 => MintInfo[]) public requestIdToMintInfos;
  mapping(uint256 => uint256) public tokenIdToRandomNumber;

  VRFCoordinatorV2Interface public COORDINATOR;

  uint64 public s_subscriptionId;
  bytes32 public keyHash;
  uint32 public callbackGasLimit;
  uint16 public requestConfirmations;
  uint256 public mintLimit;
  uint256 public mintPrice;
  string private _baseTokenURI;

  constructor(
    address vrfCoordinator,
    uint64 subscriptionId,
    bytes32 _keyHash,
    uint32 _callbackGasLimit,
    uint16 _requestConfirmations,
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint256 _mintLimit,
    uint256 _mintPrice
  ) VRFConsumerBaseV2(vrfCoordinator) ERC721(name, symbol) {
    COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
    s_subscriptionId = subscriptionId;
    keyHash = _keyHash;
    callbackGasLimit = _callbackGasLimit;
    requestConfirmations = _requestConfirmations;
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
    uint256 totalSupply = totalSupply();
    require(totalSupply + amount <= mintLimit, "NFTDoor: mint limit exceeded");
    require(msg.value == mintPrice, "NFTDoor: msg value invalid");

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
      emit Requested(tokenId);
    }
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

  function _baseURI() internal view override returns (string memory) {
    return _baseTokenURI;
  }
}
