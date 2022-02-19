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

// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;
 
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
 
import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    uint256 constant ether_unit = 1e18; 
    uint256 constant listingRatioNum = 25;
    uint256 constant listingRatioDen = 1000;

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }
 
    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable creator;
        address payable seller;
        address payable owner;
        uint256 price;
        bool isOnSale;
        bool isOnLease;
        bool isOnAuction;
        uint256 startSaleDate;
        uint256 endSaleDate;
    }
 
    mapping(uint256 => MarketItem) internal idToMarketItem;
    mapping(uint256 => address) internal allowance;
 
    event MarketItemCreated (
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator,
        address seller,
        address owner,
        uint256 price,
        bool isOnSale,
        bool isOnLease,
        bool isOnAuction,
        uint256 startSaleDate,
        uint256 endSaleDate
    );
 
    event MarketItemOnMarket(
        uint256 tokenId,
        uint256 price,
        bool isOnSale,
        bool isOnLease,
        bool isOnAuction,
        uint256 startSaleDate,
        uint256 endSaleDate
    );

    event MarketItemOffMarket(
        uint256 tokenId
    );

    event MarketItemPurchaseTransaction (
        uint256 tokenId,
        address seller,
        address buyer,
        uint256 price
    );

    event MarketItemNonPurchaseTransaction (
        uint256 tokenId,
        address seller,
        address buyer
    );
 
    event MarketItemsCreated (
        uint256[] indexed itemIds,
        address[] indexed nftContracts,
        uint256[] indexed tokenIds,
        address[] creator,
        address[] seller,
        address[] owner,
        uint256[] price,
        bool[] isOnSale,
        bool[] isOnLease,
        bool[] isOnAuction,
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

    /* Clears the price, isOnSale, isOnLease, isOnAuction, startSaleDate, endSaleDate of the given item */
    function clearItem(uint256 itemId) private {
        idToMarketItem[itemId].price = 0;
        idToMarketItem[itemId].isOnSale = false;
        idToMarketItem[itemId].isOnLease = false;
        idToMarketItem[itemId].isOnAuction = false;
        idToMarketItem[itemId].startSaleDate = 0;
        idToMarketItem[itemId].endSaleDate = 0;
    }

    /* Returns if the message sender is valid to use the token */
    function getMarketValid(
        uint256 itemId,
        uint256 currentDate
    ) public view returns (bool) {
        bool isOnSale = idToMarketItem[itemId].isOnSale;
        bool isOnLease = idToMarketItem[itemId].isOnLease;
        bool isOnAuction = idToMarketItem[itemId].isOnAuction;
        uint256 startSaleDate = idToMarketItem[itemId].startSaleDate;
        uint256 endSaleDate = idToMarketItem[itemId].endSaleDate;
        if (isOnSale || isOnLease || isOnAuction) {
            if (currentDate < startSaleDate || currentDate > endSaleDate) {
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
        uint256 itemId = _itemIds.current();
 
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
            0,
            0
        );
 
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
 
        allowance[tokenId] = msg.sender;

        emit MarketItemCreated(
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
        uint256 paramsLength = tokenIds.length;
        uint256[] memory itemIds = new uint256[](paramsLength);
        address[] memory nftContracts = new address[](paramsLength);
        address[] memory msgSenders = new address[](paramsLength);
        address[] memory addressZeroes = new address[](paramsLength);
        uint256[] memory zeroes = new uint256[](paramsLength);
        bool[] memory falses = new bool[](paramsLength);

        for (uint256 i = 0; i < paramsLength; i++) {
            _itemIds.increment();
            uint256 itemId = _itemIds.current();
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
                0,
                0
            );
    
            IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

            allowance[tokenId] = msg.sender;
        }
        
        emit MarketItemsCreated(
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
            zeroes,
            zeroes
        );
    }

    /* Puts the token on sale / lease / auction */
    function changeUpSaleLeaseAuctionMarketItem(
        uint256 itemId,
        uint256 price,
        bool isOnSale,
        bool isOnLease,
        bool isOnAuction,
        uint256 startSaleDate,
        uint256 endSaleDate
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingRatioNum, "Price must be equal to listing ratio's numerator");

        uint256 tokenId = idToMarketItem[itemId].tokenId;

        // Modifies the token's data
        idToMarketItem[itemId].price = price;
        idToMarketItem[itemId].isOnSale = isOnSale;
        idToMarketItem[itemId].isOnLease = isOnLease;
        idToMarketItem[itemId].isOnAuction = isOnAuction;
        idToMarketItem[itemId].startSaleDate = startSaleDate;
        idToMarketItem[itemId].endSaleDate = endSaleDate;
        address seller = idToMarketItem[itemId].seller;
        if (msg.sender != seller) {
            idToMarketItem[itemId].seller = payable(msg.sender);
        }

        emit MarketItemOnMarket(
            tokenId,
            price,
            isOnSale,
            isOnLease,
            isOnAuction,
            startSaleDate,
            endSaleDate
        );
    }

    /* Puts the token down from sale / lease / auction */
    function changeDownSaleLeaseAuctionMarketItem(
        uint256 itemId
    ) public payable nonReentrant {
        uint256 tokenId = idToMarketItem[itemId].tokenId;

        clearItem(itemId);
        address seller = idToMarketItem[itemId].seller;
        if (address(0) != seller) {
            idToMarketItem[itemId].seller = payable(address(0));
        }

        emit MarketItemOffMarket(
            tokenId
        );
    }
    
    /* Transfer ownership from one user to another */
    function createTransferOwnership(
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        bool isOnSale = idToMarketItem[itemId].isOnSale;
        bool isOnLease = idToMarketItem[itemId].isOnLease;
        bool isOnAuction = idToMarketItem[itemId].isOnAuction;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        address creator = idToMarketItem[itemId].creator;
        address seller = idToMarketItem[itemId].seller;

        require(isOnSale != true, "The item cannot be on Sale");
        require(isOnLease != true, "The item cannot be on Lease");
        require(isOnAuction != true, "The item cannot be on Auction");

        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        clearItem(itemId);
        if (allowance[tokenId] == creator) {
            allowance[tokenId] = address(0);
        }

        emit MarketItemNonPurchaseTransaction(
            tokenId,
            seller,
            msg.sender
        );
    }

    /* Perform sale */
    function createMarketSale(
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        bool isOnSale = idToMarketItem[itemId].isOnSale;
        address seller = idToMarketItem[itemId].seller;

        require(msg.value == price, "Please submit the asking value in order to complete the purchase");
        require(isOnSale == true, "The item has to be on sale");
 
        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        clearItem(itemId);
        // transfering sale listing price
        uint256 saleListingRatioNum = (price * (listingRatioNum / listingRatioDen)) * ether_unit;
        payable(owner).transfer(saleListingRatioNum);
        if (allowance[tokenId] == address(this)) {
            allowance[tokenId] = address(0);
        }

        emit MarketItemPurchaseTransaction(
            tokenId,
            seller,
            msg.sender,
            price
        );
    }

    /* Deletes the token */
    function deleteItem(
        uint256 itemId,
        uint256 tokenId
    ) public payable nonReentrant {
        address owner = idToMarketItem[itemId].owner;
        require( owner == msg.sender || allowance[tokenId] == msg.sender );

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
            0,
            0
        );
    }

    /* Fetchs one token by itemId */
    function fetchItemByItemId(
        uint256 itemId
    ) public view returns (MarketItem memory) {
        MarketItem memory item = idToMarketItem[itemId];
        return item;
    }

    /* Fetches multiple tokens by itemIds */
    function fetchItemsByItemIds(
        uint256[] memory itemIds
    ) public view returns (MarketItem[] memory) {
        uint256 itemIdsLength = itemIds.length;
        MarketItem[] memory items = new MarketItem[](itemIdsLength);
        for (uint256 i = 0; i < itemIdsLength; i++) {
            uint256 itemId = itemIds[i];
            MarketItem storage item = idToMarketItem[itemId];
            items[i] = item;
        }
        return items;
    }

    /* Fetches one token by itemId */
    function fetchItemByTokenId(
        uint256 tokenId
    ) public view returns (MarketItem memory) {
        uint256 totalItemCount = _itemIds.current();
        MarketItem[] memory items = new MarketItem[](1);

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].tokenId == tokenId) {
                uint256 currentId = i + 1;
                MarketItem storage item = idToMarketItem[currentId];
                items[0] = item;
            }
        }
        return items[0];
    }

    /* Functions for testing */
    function fetchItemsByTokenIds(
        uint256[] memory tokenIds
    ) public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 tokenIdsLength = tokenIds.length;
        uint256 currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](tokenIdsLength);

        for (uint256 i = 0; i < totalItemCount; i++) {
            uint256 tokenId = tokenIds[currentIndex];
            if (idToMarketItem[i + 1].tokenId == tokenId) {
                uint256 currentId = i + 1;
                MarketItem storage item = idToMarketItem[currentId];
                items[currentIndex] = item;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items that a user has purchased */
    function fetchUserItems() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;
   
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender || idToMarketItem[i + 1].creator == msg.sender) {
                itemCount += 1;
            }
        }
   
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender || idToMarketItem[i + 1].creator == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}