/* Handles the following
 * Minting
 * Deleting 
 * Selling
 * Transferring
 * Fetching
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
 
    mapping(uint256 => MarketItem) internal idToMarketItem; // uint256 --> itemId
    mapping(address => mapping(uint256 => MarketItem)) internal creatorToTokenIdToMarketItem; // address --> msg.sender address | uint256 --> tokenId
    mapping(address => mapping(uint256 => MarketItem)) internal ownerToTokenIdToMarketItem; // address --> msg.sender address | uint256 --> tokenId
    mapping(address => uint256[]) internal creatorTokenIds; // address --> msg.sender address | uint256[] --> tokenIds
    mapping(address => uint256[]) internal ownerTokenIds; // address --> msg.sender address | uint256 --> tokenIds
    mapping(uint256 => address) internal allowance; // uint256 --> tokenid | address --> msg.sender address
    event MarketItemCreated (
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator
    );

    event MarketItemsCreated (
        address indexed nftContract,
        uint256[] indexed tokenIds,
        address creator
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

    /* Returns the listing ratio's numerator of the contract */
    function getListingRatioNum() public view returns (uint256) {
        return listingRatioNum;
    }

    /* Returns the listing ratio's denominator of the contract */
    function getListingRatioDen() public view returns (uint256) {
        return listingRatioDen;
    }

    /* Returns if the message sender is valid to use the token */
    function getMarketValid(
        uint256 itemId,
        uint256 currentDate
    ) public view returns (bool) {
        if (idToMarketItem[itemId].isOnSale || idToMarketItem[itemId].isOnLease || idToMarketItem[itemId].isOnAuction) {
            if (currentDate < idToMarketItem[itemId].startSaleDate || currentDate > idToMarketItem[itemId].endSaleDate) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
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

    /* Add a tokenId to a address in creatorTokenIds */
    function creatorTokenIdsAddTokenId(
        address creator,
        uint256 tokenId
    ) private {
        uint256[] storage tokenIds = creatorTokenIds[creator];
        tokenIds.push(tokenId);
        creatorTokenIds[creator] = tokenIds;
    }
    
    /* Remove a tokenId to a address in creatorTokenIds (sets it to 0) */
    function creatorTokenIdsRemoveTokenId(
        address creator,
        uint256 tokenId
    ) private {
        uint256[] storage tokenIds = creatorTokenIds[creator];
        uint256 index = tokenIds.length; 
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenIds[i] == tokenId) {
                index = i;
            }
        }
        if (index != tokenIds.length) {
            tokenIds[index] = tokenIds[tokenIds.length - 1];
            tokenIds.pop();
        }
        creatorTokenIds[creator] = tokenIds;
    }
    
    /* Add a tokenId to a address in ownerTokenIds */
    function ownerTokenIdsAddTokenId(
        address tokenOwner,
        uint256 tokenId
    ) private {
        uint256[] storage tokenIds = ownerTokenIds[tokenOwner];
        tokenIds.push(tokenId);
        ownerTokenIds[tokenOwner] = tokenIds;        
    }
    
    /* Remove a tokenId to a address in ownerTokenIds (sets it to 0) */
    function ownerTokenIdsRemoveTokenId(
        address tokenOwner,
        uint256 tokenId
    ) private {
        uint256[] storage tokenIds = ownerTokenIds[tokenOwner];
        uint256 index = tokenIds.length; 
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenIds[i] == tokenId) {
                index = i;
            }
        }
        if (index != tokenIds.length) {
            tokenIds[index] = tokenIds[tokenIds.length - 1];
            tokenIds.pop();
        }
        ownerTokenIds[tokenOwner] = tokenIds;
    }

    /* Mints one token */
    function createMintMarketItem(
        address nftContract,
        uint256 tokenId
    ) public payable nonReentrant {
        _itemIds.increment();
        uint256 itemId = _itemIds.current();
 
        MarketItem memory item = MarketItem(
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

        idToMarketItem[itemId] = item;
 
        creatorToTokenIdToMarketItem[msg.sender][tokenId] = item;
        creatorTokenIdsAddTokenId(msg.sender, tokenId);

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
 
        allowance[tokenId] = msg.sender;

        emit MarketItemCreated(
            nftContract,
            tokenId,
            msg.sender
        );
    }

    /* Mints multiple token */
    function createMintMarketItems(
        address nftContract,
        uint256[] memory tokenIds
    ) public payable nonReentrant {

        for (uint256 i = 0; i < tokenIds.length; i++) {
            _itemIds.increment();
            uint256 itemId = _itemIds.current();
            uint256 tokenId = tokenIds[i];

            MarketItem memory item = MarketItem(
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

            idToMarketItem[itemId] = item;

            creatorToTokenIdToMarketItem[msg.sender][tokenId] = item;
            creatorTokenIdsAddTokenId(msg.sender, tokenId);
    
            IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

            allowance[tokenId] = msg.sender;
        }

        emit MarketItemsCreated(
            nftContract,
            tokenIds,
            msg.sender
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
        require(price > 0, "price 0 or less");
        require(msg.value == listingRatioNum, "price not same as listed ratio num");

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
            idToMarketItem[itemId].tokenId,
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
        clearItem(itemId);
        if (address(0) != idToMarketItem[itemId].seller) {
            idToMarketItem[itemId].seller = payable(address(0));
        }

        emit MarketItemOffMarket(
            idToMarketItem[itemId].tokenId
        );
    }
    
    /* Transfer ownership from one msg.sender to another */
    function createTransferOwnership(
        address nftContract,
        uint256 itemId,
        address receiver
    ) public payable nonReentrant {
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        address creator = idToMarketItem[itemId].creator;
        address originalOwner = idToMarketItem[itemId].owner;

        // Validation
        require(idToMarketItem[itemId].isOnSale != true, "item on sale");
        require(idToMarketItem[itemId].isOnLease != true, "item on Lease");
        require(idToMarketItem[itemId].isOnAuction != true, "item on Auction");

        // Transferring ownership
        IERC721(nftContract).transferFrom(address(this), receiver, tokenId);
        idToMarketItem[itemId].owner = payable(receiver);

        // Updating ownerToTokenIdToMarketItem nested mapping
        MarketItem storage item = idToMarketItem[itemId];
        // handle originalOwner
        if (originalOwner != address(0)) {
            ownerToTokenIdToMarketItem[originalOwner][tokenId] = MarketItem(
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
            ownerTokenIdsRemoveTokenId(originalOwner, tokenId);
        }
        // handle msg.sender
        ownerToTokenIdToMarketItem[receiver][tokenId] = item;
        ownerTokenIdsAddTokenId(receiver, tokenId);

        // Clear allowance to creator
        clearItem(itemId);
        if (allowance[tokenId] == creator) {
            allowance[tokenId] = address(0);
        }

        // Emit event
        emit MarketItemNonPurchaseTransaction(
            tokenId,
            address(this),
            receiver
        );
        /*
        */
    }

    /* Perform sale */
    function createMarketSale(
        address nftContract,
        uint256 itemId,
        uint256 currentDate
    ) public payable nonReentrant {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        address seller = idToMarketItem[itemId].seller;
        address creator = idToMarketItem[itemId].creator;
        address originalOwner = idToMarketItem[itemId].owner;

        // Validation
        require(msg.value == price, "value incorrect");
        require(idToMarketItem[itemId].isOnSale == true, "item not on sale");
        require(getMarketValid(itemId, currentDate), "not on market");

        // Transfer ownership
        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        clearItem(itemId);
        
        // Transfering sale listing price
        uint256 saleListingRatioNum = (price * (listingRatioNum / listingRatioDen)) * ether_unit;
        payable(owner).transfer(saleListingRatioNum);
        if (allowance[tokenId] == address(this)) {
            allowance[tokenId] = address(0);
        }

        // Updating ownerToTokenIdToMarketItem nested mapping
        MarketItem storage item = idToMarketItem[itemId];
        // handle originalOwner
        if (originalOwner != address(0)) {
            ownerToTokenIdToMarketItem[originalOwner][tokenId] = MarketItem(
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
            ownerTokenIdsRemoveTokenId(originalOwner, tokenId);
        }
        // handle msg.sender
        ownerToTokenIdToMarketItem[msg.sender][tokenId] = item;
        ownerTokenIdsAddTokenId(originalOwner, tokenId);

        // Clear allowance to creator
        clearItem(itemId);
        if (allowance[tokenId] == creator) {
            allowance[tokenId] = address(0);
        }

        // Emit event
        emit MarketItemPurchaseTransaction(
            tokenId,
            seller,
            msg.sender,
            price
        );
        /*
        */
    }

    /* Deletes the token */
    function deleteItem(
        uint256 itemId,
        uint256 tokenId
    ) public payable nonReentrant {
        address creator = idToMarketItem[itemId].creator;
        address tokenOwner = idToMarketItem[itemId].owner;
        
        // Validation
        require( tokenOwner == msg.sender || allowance[tokenId] == msg.sender );

        MarketItem memory emptyItem = MarketItem(
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

        // Set item in idToMarketItem to non-existing address
        idToMarketItem[itemId] = emptyItem;

        // Set item in creatorToTokenIdToMarketItem to non-existing address
        creatorToTokenIdToMarketItem[creator][tokenId] = emptyItem;
        creatorTokenIdsRemoveTokenId(creator, tokenId);

        // Execute the following code only if the owner of the token exists
        if (tokenOwner != address(0)) {
            // Set item in ownerToTokenIdToMarketItem to non-existing address
            ownerToTokenIdToMarketItem[tokenOwner][tokenId] = emptyItem;
            ownerTokenIdsRemoveTokenId(tokenOwner, tokenId);
        }
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
        MarketItem[] memory items = new MarketItem[](itemIds.length);
        for (uint256 i = 0; i < itemIds.length; i++) {
            uint256 itemId = itemIds[i];
            MarketItem memory item = idToMarketItem[itemId];
            items[i] = item;
        }
        return items;
    }

    function fetchItemByTokenIdAndCreatorAddress(
        uint256 tokenId,
        address creator
    ) public view returns (MarketItem memory) {
        MarketItem memory item = creatorToTokenIdToMarketItem[creator][tokenId];
        return item;        
    }

    function fetchItemsByTokenIdsAndCreatorAddress(
        uint256[] memory tokenIds,
        address creator
    ) public view returns (MarketItem[] memory) {
        MarketItem[] memory items = new MarketItem[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            MarketItem memory item = creatorToTokenIdToMarketItem[creator][tokenIds[i]];
            items[i] = item;
        } 
        return items;
    }

    function fetchUserCreatedItems(
        address user
    ) public view returns (MarketItem[] memory) {        
        uint256[] memory tokenIds = creatorTokenIds[user];
        MarketItem[] memory items = new MarketItem[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            MarketItem memory item = creatorToTokenIdToMarketItem[user][tokenIds[i]];
            items[i] = item;
        }
        return items;
    }
    
    function fetchUserOwnedItems(
        address user
    ) public view returns (MarketItem[] memory) {
        uint256[] memory tokenIds = ownerTokenIds[user];
        MarketItem[] memory items = new MarketItem[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            MarketItem memory item = ownerToTokenIdToMarketItem[user][tokenIds[i]];
            items[i] = item;
        }
        return items;
    }
}