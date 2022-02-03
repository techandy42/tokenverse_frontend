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
* msg.value - numeric value fetched using the getListingRatioNum() function
*/
 
/*
* Variables Description:
* itemId - index number of a token in idToMarketItem
* tokenId - id of the token that has access to tokenURI
 */
 
/* List of information included as metadata:
*  
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
    uint constant ether_unit = 1e18; 
    uint256 constant listingRatioNum = 25;
    uint256 constant listingRatioDen = 1000;

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }
 
    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable creator;
        address payable seller;
        address payable owner;
        uint256 price;
        bool isOnSale;
        bool isOnLease;
        bool isOnAuction;
        bool isFrozen;
        uint256 startSaleDate;
        uint256 endSaleDate;
    }
 
    mapping(uint256 => MarketItem) private idToMarketItem;
 
    event MarketItemEvent (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator,
        address seller,
        address owner,
        uint256 price,
        bool isOnSale,
        bool isOnLease,
        bool isOnAuction,
        bool isFrozen,
        uint256 startSaleDate,
        uint256 endSaleDate
    );
 
    event MarketItemsEvent (
        uint[] indexed itemIds,
        address[] indexed nftContracts,
        uint256[] indexed tokenIds,
        address[] creator,
        address[] seller,
        address[] owner,
        uint256[] price,
        bool[] isOnSale,
        bool[] isOnLease,
        bool[] isOnAuction,
        bool[] isFrozen,
        uint256[] startSaleDate,
        uint256[] endSaleDate
    );
 
    /* Returns the listing ratio's numerator of the contract */
    function getListingRatioNum() public view returns (uint256) {
        return listingRatioNum;
    }

    /* Returns the listing ratio's denominator of the contract */
    function getListingRatioDen() public view returns (uint256) {
        return listingRatioDen;
    }

    function getIsFrozenByItemId(
        uint itemId
    ) public view returns (bool) {
        bool isFrozen = idToMarketItem[itemId].isFrozen;
        return isFrozen;
    }

    /* Clears the price, isOnSale, isOnLease, isOnAuction, startSaleDate, endSaleDate of the given item */
    function clearItem(uint itemId) private {
        idToMarketItem[itemId].price = 0;
        idToMarketItem[itemId].isOnSale = false;
        idToMarketItem[itemId].isOnLease = false;
        idToMarketItem[itemId].isOnAuction = false;
        idToMarketItem[itemId].startSaleDate = 0;
        idToMarketItem[itemId].endSaleDate = 0;
    }

    /* Returns if the msg.sender is valid to use the token */
    function getSaleValid(
        MarketItem memory item,
        uint currentDate
    ) public view returns (bool) {
        if (item.isOnSale || item.isOnLease || item.isOnAuction) {
            if (currentDate < item.startSaleDate || currentDate > item.endSaleDate) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    /* Mints one token */
    function createMintMarketItem(
        address nftContract,
        uint256 tokenId
    ) public payable nonReentrant {
        _itemIds.increment();
        uint itemId = _itemIds.current();
 
        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(msg.sender),
            payable(address(0)),
            0,
            false,
            false,
            false,
            false,
            0,
            0
        );
 
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
 
        emit MarketItemEvent(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            msg.sender,
            address(0),
            0,
            false,
            false,
            false,
            false,
            0,
            0
        );
    }

    /* Mints multiple token */
    function createMintMarketItems(
        address nftContract,
        uint256[] memory tokenIds
    ) public payable nonReentrant {

        // loop over the params
        // store them in list to emit 
        uint paramsLength = tokenIds.length;
        uint[] memory itemIds = new uint[](paramsLength);
        address[] memory nftContracts = new address[](paramsLength);
        address[] memory msgSenders = new address[](paramsLength);
        address[] memory addressZeroes = new address[](paramsLength);
        uint[] memory zeroes = new uint[](paramsLength);
        bool[] memory falses = new bool[](paramsLength);

        for (uint i = 0; i < paramsLength; i++) {
            _itemIds.increment();
            uint itemId = _itemIds.current();
            uint256 tokenId = tokenIds[i];

            // fill the arrays with values
            itemIds[i] = itemId;
            nftContracts[i] = nftContract;
            msgSenders[i] = msg.sender;
            addressZeroes[i] = address(0);
            zeroes[i] = 0;
            falses[i] = false; 

            idToMarketItem[itemId] = MarketItem(
                itemId,
                nftContract,
                tokenId,
                payable(msg.sender),
                payable(msg.sender),
                payable(address(0)),
                0,
                false,
                false,
                false,
                false,
                0,
                0
            );
    
            IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        }
        
        emit MarketItemsEvent(
            itemIds,
            nftContracts,
            tokenIds,
            msgSenders,
            msgSenders,
            addressZeroes,
            zeroes,
            falses,
            falses,
            falses,
            falses,
            zeroes,
            zeroes
        );
    }

    /* Puts the token on sale / lease / auction */
    function changeUpSaleLeaseAuctionMarketItem(
        uint itemId,
        uint256 price,
        bool isOnSale,
        bool isOnLease,
        bool isOnAuction,
        bool isFrozen,
        uint256 startSaleDate,
        uint256 endSaleDate
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingRatioNum, "Price must be equal to listing ratio's numerator");

        // Modifies the token's data
        idToMarketItem[itemId].price = price;
        idToMarketItem[itemId].isOnSale = isOnSale;
        idToMarketItem[itemId].isOnLease = isOnLease;
        idToMarketItem[itemId].isOnAuction = isOnAuction;
        idToMarketItem[itemId].startSaleDate = startSaleDate;
        idToMarketItem[itemId].endSaleDate = endSaleDate;
        bool isAlreadyFrozen = idToMarketItem[itemId].isFrozen;
        if (!isAlreadyFrozen && isFrozen) {
            idToMarketItem[itemId].isFrozen = isFrozen;
        } 
        address seller = idToMarketItem[itemId].seller;
        if (msg.sender != seller) {
            idToMarketItem[itemId].seller = payable(msg.sender);
        }
    }

    /* Edits the token data */
    function changeEditMarketItem(
        uint itemId,
        bool isFrozen
    ) public {
        // Modifies the token's data
        bool isAlreadyFrozen = idToMarketItem[itemId].isFrozen;
        if (!isAlreadyFrozen && isFrozen) {
            idToMarketItem[itemId].isFrozen = isFrozen;
        } 
    }

    /* Puts the token down from sale / lease / auction */
    function changeDownSaleLeaseAuctionMarketItem(
        uint itemId
    ) public payable nonReentrant {
        clearItem(itemId);
        address seller = idToMarketItem[itemId].seller;
        if (address(0) != seller) {
            idToMarketItem[itemId].seller = payable(address(0));
        }
    }
    
    /* Transfer ownership from one user to another */
    function createTransferOwnership(
        address nftContract,
        uint itemId
    ) public payable nonReentrant {
        bool isOnSale = idToMarketItem[itemId].isOnSale;
        bool isOnLease = idToMarketItem[itemId].isOnLease;
        bool isOnAuction = idToMarketItem[itemId].isOnAuction;
        uint256 tokenId = idToMarketItem[itemId].tokenId;

        require(isOnSale != true, "The item cannot be on Sale");
        require(isOnLease != true, "The item cannot be on Lease");
        require(isOnAuction != true, "The item cannot be on Auction");

        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        clearItem(itemId);
    }

    /* Perform sale */
    function createMarketSale(
        address nftContract,
        uint itemId
    ) public payable nonReentrant {
        uint price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        bool isOnSale = idToMarketItem[itemId].isOnSale;

        require(msg.value == price, "Please submit the asking value in order to complete the purchase");
        require(isOnSale == true, "The item has to be on sale");
 
        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        clearItem(itemId);
        // transfering sale listing price
        // this doesn't work
        uint saleListingRatioNum = (price * (listingRatioNum / listingRatioDen)) * ether_unit;
        payable(owner).transfer(saleListingRatioNum);
    }

    /* Deletes the token */
    function deleteItem(
        uint itemId,
        uint256 tokenId
    ) public payable nonReentrant {
        address owner = idToMarketItem[itemId].owner;
        require (((owner != address(0)) && (owner == msg.sender)), "The owner must be the message sender and not a null address");
        idToMarketItem[itemId] = MarketItem(
            itemId,
            address(0),
            tokenId,
            payable(address(0)),
            payable(address(0)),
            payable(address(0)),
            0,
            false,
            false,
            false,
            false,
            0,
            0
        );

        emit MarketItemEvent(
            itemId,
            address(0),
            tokenId,
            address(0),
            address(0),
            address(0),
            0,
            false,
            false,
            false,
            false,
            0,
            0
        );
    }

    /* Fetchs one token by itemId */
    function fetchItemByItemId(
        uint itemId
    ) public view returns (MarketItem memory) {
        MarketItem storage item = idToMarketItem[itemId];
        return item;
    }

    /* Fetches multiple tokens by itemIds */
    function fetchItemsByItemIds(
        uint[] memory itemIds
    ) public view returns (MarketItem[] memory) {
        uint itemIdsLength = itemIds.length;
        MarketItem[] memory items = new MarketItem[](itemIdsLength);
        for (uint i = 0; i < itemIdsLength; i++) {
            uint itemId = itemIds[i];
            MarketItem storage item = idToMarketItem[itemId];
            items[i] = item;
        }
        return items;
    }
 
    /* Functions for testing */

    /* Returns only items that a user has purchased */
    function fetchUserItems() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
   
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender || idToMarketItem[i + 1].creator == msg.sender) {
                itemCount += 1;
            }
        }
   
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender || idToMarketItem[i + 1].creator == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
