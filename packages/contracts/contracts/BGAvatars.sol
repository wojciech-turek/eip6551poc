// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import './interfaces/IERC6551Registry.sol';

contract BGAvatars is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    ERC721Burnable,
    Ownable
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    address public accountImplementation;
    IERC6551Registry public registry;
    address battleContract;

    event AvatarCreated(
        address indexed owner,
        uint256 indexed tokenId,
        address indexed account,
        string tokenURI
    );

    constructor(
        address _accountImplementation,
        address _registry,
        address _battleContract
    ) ERC721('BGAvatars', 'BGA') {
        _tokenIdCounter.increment();
        accountImplementation = _accountImplementation;
        registry = IERC6551Registry(_registry);
        battleContract = _battleContract;
        setApprovalForAll(battleContract, true);
    }

    function _baseURI() internal pure override returns (string memory) {
        return 'ipfs://';
    }

    function safeMint(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        address account = registry.createAccount(
            accountImplementation,
            block.chainid,
            address(this),
            tokenId,
            tokenId,
            ''
        );

        emit AvatarCreated(to, tokenId, account, tokenURI(tokenId));
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
