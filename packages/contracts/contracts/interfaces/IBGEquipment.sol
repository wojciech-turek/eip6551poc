// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @dev the ERC-165 identifier for this interface is `0x6faff5f1`
interface IBGEquipment {
    function getOwnedTokens(address owner) external view returns (uint256[] memory);
}
