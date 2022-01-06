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
* itemId - index number of a token in idToMarketItem
* tokenId - id of the token that has access to tokenURI
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
    Counters.Counter private _itemsSale;
 
    address payable owner;
    uint256 listingPrice = 0.025 ether;
 
    constructor() {
        owner = payable(msg.sender);
    }
 
    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address creator;
        address payable seller;
        address payable owner;
        uint256 price;
        bool onSale;
        bool frozen;
    }
 
    mapping(uint256 => MarketItem) private idToMarketItem;
 
    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator,
        address seller,
        address owner,
        uint256 price,
        bool onSale,
        bool frozen
    );
 
    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }
 
    /* Mints the token */
    function createMintMarketItem(
        address nftContract,
        uint256 tokenId
    ) public payable nonReentrant {
        _itemIds.increment();
        uint256 itemId = _itemIds.current();
 
        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            payable(msg.sender),
            payable(address(0)),
            0,
            false,
            false
        );
 
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
 
        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            msg.sender,
            address(0),
            0,
            false,
            false
        );
    }

    /* Puts the token on sale */
    function changeSaleMarketItem(
        uint256 itemId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        _itemsSale.increment();

        idToMarketItem[itemId].price = price;
        idToMarketItem[itemId].onSale = true;
        address seller = idToMarketItem[itemId].seller;
        if (msg.sender != seller) {
            idToMarketItem[itemId].seller = payable(msg.sender);
        }
    }

    function createMarketSale(
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        bool onSale = idToMarketItem[itemId].onSale;
        require(msg.value == price, "Please submit the asking value in order to complete the purchase");
        require(onSale == true, "The item is not on the market");
       
        _itemsSale.decrement();
 
        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].onSale = false;
        payable(owner).transfer(listingPrice);
    }
 
    /* Returns all market items (items listed in the market) */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemsSaleCount = _itemsSale.current();
        uint currentIndex = 0;
 
        MarketItem[] memory items = new MarketItem[](itemsSaleCount);
        for (uint i = 0; i < itemsSaleCount; i++) {
            if (idToMarketItem[i + 1].onSale == true) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
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
    function fetchUserPurchasedItems() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
   
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }
   
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
   
    function fetchUserCreatedNotSaleItems() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
   
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].creator == msg.sender && idToMarketItem[i + 1].onSale == false) {
                itemCount += 1;
            }
        }
   
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].creator == msg.sender && idToMarketItem[i + 1].onSale == false) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
   
    function fetchUserCreatedSaleItems() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
   
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].creator == msg.sender && idToMarketItem[i + 1].onSale == true && idToMarketItem[i + 1].owner == address(0)) {
                itemCount += 1;
            }
        }
   
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].creator == msg.sender && idToMarketItem[i + 1].onSale == true && idToMarketItem[i + 1].owner == address(0)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
   
    function fetchUserCreatedSoldItems() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
   
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].creator == msg.sender && idToMarketItem[i + 1].owner != address(0)) {
                itemCount += 1;
            }
        }
   
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].creator == msg.sender && idToMarketItem[i + 1].owner != address(0)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Helper Functions */

    /* Returns the item for the given itemId */
    function fetchMarketItemByItemId(
        uint256 itemId
    ) public view returns (MarketItem memory) {
        MarketItem storage item = idToMarketItem[itemId];
        return item;
    }
 
    /* Returns the items for the given array of itemIds */
    function fetchMarketItemsByItemIds(
        uint256[] memory itemIds
    ) public view returns (MarketItem[] memory){
        uint itemsLength = itemIds.length;
        MarketItem[] memory items = new MarketItem[](itemsLength);
        for (uint i = 0; i < itemsLength; i++) {
            uint itemId = itemIds[i];
            items[i] = idToMarketItem[itemId];
        }
        return items;
    }
}
