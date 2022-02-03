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

    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
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
            newItemIds[i] = newItemId;
        }
        return newItemIds;
    }

    function changeTokenIdToken(uint256 tokenId, string memory newTokenURI) public {
        _setTokenURI(tokenId, newTokenURI);
    }

    function burn(
        uint256 tokenId
    ) public {
        require(_isApprovedOrOwner(msg.sender, tokenId));
        _burn(tokenId);
    }
}