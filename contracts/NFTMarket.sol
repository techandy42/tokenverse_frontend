/*  
* Arguments Descriptions:
* nftContract - ex: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
* tokenId - numeric value containing information about the token (name, description, etc.) 
*           created from the following code
  //   let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
  //   let transaction = await contract.createToken(url)
  //   // url is the URL of all of the data
  //   let tx = await transaction.wait()
  //   let event = tx.events[0]
  //   let value = event.args[2]
  //   let tokenId = value.toNumber()
* price - numeric value create from the following code
  //   const price = ethers.utils.parseUnits(formTextField.price, 'ether')
* msg.value - numeric value fetched using the getListingPrice() function
*/

/*
* Variables Description:
* itemId - index number of a token in idToItem
 */

// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
 
import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsMarket;

    address payable owner;
    uint256 listingPrice = 0.025 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    struct Item {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool onMarket;
    }

    mapping(uint256 => Item) private idToItem;

    event ItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool onMarket
    );

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    /* Mints the token */
    function createMintItem(
        address nftContract,
        uint256 tokenId
    ) public payable nonReentrant {
        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToItem[itemId] = Item(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            0,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit ItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            0,
            false
        );
    }

    /* Lists the token for sale in the market */
    function createMarketItem(
        uint256 itemId,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        _itemsMarket.increment();

        idToItem[itemId].tokenId = tokenId;
        idToItem[itemId].price = price;
        idToItem[itemId].onMarket = true;
    }

    function createUnmarketItem(
        uint256 itemId
    ) public nonReentrant {

        _itemsMarket.decrement();

        idToItem[itemId].price = 0;
        idToItem[itemId].onMarket = false;
    }

    function createModifyMintedItem(
        uint256 itemId,
        uint256 tokenId
    ) public nonReentrant {
        idToItem[itemId].tokenId = tokenId;
    }

    function createModifyMarketItem(
        uint256 itemId,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        idToItem[itemId].tokenId = tokenId;
        idToItem[itemId].price = price;
    }

    function createMarketSale(
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        uint price = idToItem[itemId].price;
        uint tokenId = idToItem[itemId].tokenId;
        bool onMarket = idToItem[itemId].onMarket;
        require(msg.value == price, "Please submit the asking value in order to complete the purchase");
        require(onMarket == true, "The item is not on the market");
        
        _itemsMarket.decrement();

        idToItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToItem[itemId].owner = payable(msg.sender);
        idToItem[itemId].onMarket = false;
        payable(owner).transfer(listingPrice);
    }

    /* Returns all market items (items listed in the market) */
    function fetchMarketItems() public view returns (Item[] memory) {
        uint itemMarketCount = _itemsMarket.current();
        uint currentIndex = 0;

        Item[] memory items = new Item[](itemMarketCount);
        for (uint i = 0; i < itemMarketCount; i++) {
            if (idToItem[i + 1].onMarket == true) {
                uint currentId = i + 1;
                Item storage currentItem = idToItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns the item for the given itemId */
    function fetchSpecificItemByItemId(
        uint256 itemId
    ) public view returns (Item memory) {
        Item storage item = idToItem[itemId];
        return item;
    }

    /* Returns the items for the given array of itemIds */
    function fetchSpecificItemsByItemIds(
        uint256[] memory itemIds
    ) public view returns (Item[] memory){
        uint itemsLength = itemIds.length;
        Item[] memory items = new Item[](itemsLength);
        for (uint i = 0; i < itemsLength; i++) {
            uint itemId = itemIds[i];
            items[i] = idToItem[itemId];
        }
        return items;
    }

    /* 
    * User can fetch items on:
    * all
    * purchased
    * created
    * on market 
    * not on market 
    * Add in functions as needed
     */

    /* Returns only items that a user has purchased */
    function fetchUserPurchasedItems() public view returns (Item[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
    
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }
    
        Item[] memory items = new Item[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToItem[i + 1].owner == msg.sender) {
                uint currentId = i + 1;
                Item storage currentItem = idToItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
    
    function fetchUserCreatedItems() public view returns (Item[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
    
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }
    
        Item[] memory items = new Item[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToItem[i + 1].seller == msg.sender) {
                uint currentId = i + 1;
                Item storage currentItem = idToItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}