// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    constructor(address marketplaceAddress) ERC721("Metaverse", "METT") {
        contractAddress = marketplaceAddress;
    }

    mapping(uint256 => bool) internal burnedMarketItem;
    mapping(uint256 => address) internal allowance;
    mapping(uint256 => bool) internal metadataFrozenMarketItem;

    /* Returns if the item is burned */
    function getIsBurned(
        uint itemId
    ) public view returns (bool) {
        bool isBurned = burnedMarketItem[itemId];
        return isBurned;
    }

    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        allowance[newItemId] = msg.sender;
        return newItemId;
    }

    function createTokens(string[] memory tokenURIs) public returns (uint[] memory) {
        uint256 tokenURILength = tokenURIs.length;
        uint256[] memory newItemIds = new uint256[](tokenURILength);
        for (uint i = 0; i < tokenURILength; i++) {
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            string memory tokenURI = tokenURIs[i];
            _mint(msg.sender, newItemId);
            _setTokenURI(newItemId, tokenURI);
            setApprovalForAll(contractAddress, true);
            allowance[newItemId] = msg.sender;
            newItemIds[i] = newItemId;
        }
        return newItemIds;
    }

    function changeTokenIdToken(uint256 tokenId, string memory newTokenURI, bool isMetadataFrozen) public {
        // This function will be modified to support frozen tokens through decentralized metadata storage
        // The function currently validates using a map
        address owner = ownerOf(tokenId);
        bool isCurrentlyMetadataFrozen = metadataFrozenMarketItem[tokenId];
        require(owner == msg.sender || allowance[tokenId] == msg.sender, 'The owner must be the message sender or the message sender must be approved');
        require(isCurrentlyMetadataFrozen == false, 'The metadata of the token is frozen');
        if (isMetadataFrozen == false) {
            _setTokenURI(tokenId, newTokenURI);
        } else {
            metadataFrozenMarketItem[tokenId] = true;
        }
    }

    function burn(
        uint256 tokenId
    ) public {
        address owner = ownerOf(tokenId);
        require(owner == msg.sender || allowance[tokenId] == msg.sender, 'The owner must be the message sender or the message sender must be approved');
        _burn(tokenId);
        burnedMarketItem[tokenId] = true;
    }
}