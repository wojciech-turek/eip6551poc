// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import './interfaces/IBGAvatars.sol';

contract Battle {
    IBGAvatars public avatarContract;

    event BattleCommenced(
        uint256 indexed tokenId1,
        uint256 indexed tokenId2,
        uint256 indexed winner
    );

    function initialize(address _avatarContract) external {
        avatarContract = IBGAvatars(_avatarContract);
    }

    function battle(uint256 tokenId1, uint256 tokenId2) external {
        // generate two random different numbers
        uint256 player1Roll = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.prevrandao, tokenId1)
            )
        ) % 100;

        uint256 player2Roll = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.prevrandao, tokenId2)
            )
        ) % 100;

        if (player1Roll > player2Roll) {
            avatarContract.battleBurn(tokenId2);
            emit BattleCommenced(tokenId1, tokenId2, tokenId1);
        } else if (player1Roll < player2Roll) {
            avatarContract.battleBurn(tokenId1);
            emit BattleCommenced(tokenId1, tokenId2, tokenId2);
        } else {
            emit BattleCommenced(tokenId1, tokenId2, 0);
        }
    }
}
