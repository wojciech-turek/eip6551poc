// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

interface IBGAvatars is IERC721 {
    function getOwnedTokens(
        address owner
    ) external view returns (uint256[] memory);

    function battleBurn(uint256 tokenId) external;
}
