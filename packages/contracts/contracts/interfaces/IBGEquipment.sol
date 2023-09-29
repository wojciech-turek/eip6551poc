// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

/// @dev the ERC-165 identifier for this interface is `0x6faff5f1`
interface IBGEquipment is IERC721 {
    function getOwnedTokens(
        address owner
    ) external view returns (uint256[] memory);
}
