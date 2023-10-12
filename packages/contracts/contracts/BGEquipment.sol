// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import './interfaces/IBGEquipment.sol';

contract BGEquipment is
    IBGEquipment,
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    mapping(address => uint256[]) private ownedTokens;

    event EquipmentCreated(
        address indexed owner,
        uint256 indexed tokenId,
        string tokenURI
    );
    event EquipmentTransferred(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId,
        string tokenURI
    );

    constructor() ERC721('BGEquipment', 'BGE') {
        _tokenIdCounter.increment();
    }

    function safeMint(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        ownedTokens[to].push(tokenId);
        emit EquipmentCreated(to, tokenId, tokenURI(tokenId));
    }

    function getOwnedTokens(
        address owner
    ) public view returns (uint256[] memory) {
        return ownedTokens[owner];
    }

    function removeOwnedToken(address owner, uint256 tokenId) internal {
        uint256[] storage tokens = ownedTokens[owner];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
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

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721) {
        super._afterTokenTransfer(from, to, tokenId, batchSize);
        removeOwnedToken(from, tokenId);
        ownedTokens[to].push(tokenId);
        emit EquipmentTransferred(from, to, tokenId, tokenURI(tokenId));
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
        override(IERC165, ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
