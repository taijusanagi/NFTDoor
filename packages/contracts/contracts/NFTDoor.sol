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

  event Minted(uint256 tokenId, uint256 randomNumber);

  mapping(uint256 => MintInfo[]) public requestIdToMintInfos;
  mapping(uint256 => uint256) public tokenIdToRandomNumber;

  VRFCoordinatorV2Interface COORDINATOR;
  uint64 s_subscriptionId;
  address vrfCoordinator = 0x2eD832Ba664535e5886b75D64C46EB9a228C2610;
  bytes32 keyHash = 0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61;
  uint32 callbackGasLimit = 100000;
  uint16 requestConfirmations = 3;

  uint256 public totalSupply;
  uint256 public mintLimit;
  uint256 public mintPrice;

  constructor(
    uint64 subscriptionId,
    string memory name,
    string memory symbol,
    string memory tokenBaseURI,
    uint256 mintLimit,
    uint256 mintPrice
  ) VRFConsumerBaseV2(vrfCoordinator) ERC721(name, symbol) {
    COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
    s_subscriptionId = subscriptionId;
    _tokenBaseURI = tokenBaseURI;
    mintLimit = mintLimit;
    mintPrice = mintPrice;
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
  function _baseURI() internal pure override returns (string memory) {
    return _tokenBaseURI;
  }
}
