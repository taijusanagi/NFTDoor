//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockVRFCoordinatorV2 {
  event Called();

  function requestRandomWords(
    bytes32 keyHash,
    uint64 s_subscriptionId,
    uint16 requestConfirmations,
    uint32 callbackGasLimit,
    uint32 amount
  ) external returns (uint256 requestId) {
    emit Called();
  }

  function addConsumer(uint64 subId, address consumer) external {}
}
