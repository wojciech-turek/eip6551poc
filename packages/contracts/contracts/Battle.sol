// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import './interfaces/IBGAvatars.sol';
import './interfaces/IERC6551Account.sol';
import './interfaces/IERC6551Custom.sol';
import './interfaces/IERC6551Registry.sol';

contract Battle {
    IBGAvatars public avatarContract;
    IERC6551Account public accountImplementation;
    IERC6551Registry public registry;

    event BattleCommenced(
        uint256 indexed tokenId1,
        uint256 indexed tokenId2,
        uint256 indexed winner
    );

    function initialize(
        address _avatarContract,
        address payable _accountImplementation,
        address _registry
    ) external {
        avatarContract = IBGAvatars(_avatarContract);
        accountImplementation = IERC6551Account(_accountImplementation);
        registry = IERC6551Registry(_registry);
    }

    function battle(uint256 tokenId1, uint256 tokenId2) external {
        address account1 = registry.account(
            address(accountImplementation),
            block.chainid,
            address(avatarContract),
            tokenId1,
            tokenId1
        );
        address account2 = registry.account(
            address(accountImplementation),
            block.chainid,
            address(avatarContract),
            tokenId2,
            tokenId2
        );
        // generate two random different numbers
        uint256 player1Roll = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.prevrandao, tokenId1)
            )
        ) % 100000;

        uint256 player2Roll = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.prevrandao, tokenId2)
            )
        ) % 100000;

        if (player1Roll > player2Roll) {
            avatarContract.battleBurn(tokenId2);
            IERC6551Custom(account1).increaseExperience(10);
            emit BattleCommenced(tokenId1, tokenId2, tokenId1);
        } else if (player1Roll < player2Roll) {
            avatarContract.battleBurn(tokenId1);
            IERC6551Custom(account2).increaseExperience(10);
            emit BattleCommenced(tokenId1, tokenId2, tokenId2);
        }
    }
}
