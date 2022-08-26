//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract MockVRFCoordinator {
    uint256 internal counter = 0;

    uint64 public subscriptionId = 1582;
    address vrfCoordinator = 0x2eD832Ba664535e5886b75D64C46EB9a228C2610;
    bytes32 _keyHash = 0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61;
    uint32 _callbackGasLimit = 100000;
    uint16 _requestConfirmations = 3;


    function requestRandomWords(
        bytes32 keyHash,
        uint64 s_subscriptionId,
        uint16 requestConfirmations,
        uint32 callbackGasLimit,
        uint32 amount
    ) external returns (uint256 requestId) {

        keyHash = _keyHash;
        subscriptionId = s_subscriptionId;
        requestConfirmations = _requestConfirmations;
        callbackGasLimit = _callbackGasLimit;
        amount = amount;

        VRFConsumerBaseV2 consumer = VRFConsumerBaseV2(msg.sender);
        uint256[] memory randomWords = new uint256[](1);
        randomWords[0] = counter;
        consumer.rawFulfillRandomWords(requestId, randomWords);
        counter += 1;
    }
}