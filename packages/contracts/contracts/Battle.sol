// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol';
import './interfaces/IERC6551Executable.sol';
import './interfaces/IERC6551Registry.sol';
import './interfaces/IBGEquipment.sol';

contract Battle {
    ERC721Burnable public avatarContract;
    IBGEquipment public equipmentContract;
    address public accountContract;
    IERC6551Registry public registryContract;

    event BattleEnded(
        uint256 indexed tokenId1,
        uint256 indexed tokenId2,
        uint256 indexed winner
    );
    event DamageRound(
        uint256 indexed tokenId1,
        uint256 indexed tokenId2,
        uint256 damage1,
        uint256 damage2
    );

    function initialize(
        address _avatarContract,
        address _equipmentContract,
        address _accountContract,
        address _registryContract
    ) external {
        avatarContract = ERC721Burnable(_avatarContract);
        equipmentContract = IBGEquipment(_equipmentContract);
        accountContract = _accountContract;
        registryContract = IERC6551Registry(_registryContract);
    }

    function setAvatarContract(address _avatarContract) external {
        avatarContract = ERC721Burnable(_avatarContract);
    }

    function setEquipmentContract(address _equipmentContract) external {
        equipmentContract = IBGEquipment(_equipmentContract);
    }

    function setAccountContract(address _accountContract) external {
        accountContract = _accountContract;
    }

    function setRegistryContract(address _registryContract) external {
        registryContract = IERC6551Registry(_registryContract);
    }

    function generateRandomDamage() internal view returns (uint256) {
        uint256 damage = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.prevrandao))
        );
        return uint8(damage % 11);
    }

    function battle(uint256 tokenId1, uint256 tokenId2) external {
        uint256 health1 = 100;
        uint256 health2 = 100;

        while (health1 > 0 && health2 > 0) {
            uint256 damage1 = generateRandomDamage();
            uint256 damage2 = generateRandomDamage();
            health1 -= damage2;
            health2 -= damage1;
            emit DamageRound(tokenId1, tokenId2, damage1, damage2);
        }

        if (health1 > 0 && health2 > 0) {
            resultBattle(tokenId1, tokenId2);
        } else if (health2 > 0 && health1 > 0) {
            resultBattle(tokenId2, tokenId1);
        } else {
            emit BattleEnded(tokenId1, tokenId2, 0);
        }
    }

    function resultBattle(uint256 winner, uint256 loser) internal {
        address loserAccount = registryContract.account(
            accountContract,
            block.chainid,
            address(avatarContract),
            loser,
            loser
        );
        uint256[] memory ownedEquipment = equipmentContract.getOwnedTokens(
            loserAccount
        );
        address winnerAvatarOwner = avatarContract.ownerOf(winner);
        for (uint256 i = 0; i < ownedEquipment.length; i++) {
            equipmentContract.safeTransferFrom(
                loserAccount,
                winnerAvatarOwner,
                ownedEquipment[i]
            );
        }
        avatarContract.burn(loser);
        emit BattleEnded(winner, loser, winner);
    }
}
