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
 
    struct Item {
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
 
    mapping(uint256 => Item) internal idToItem; // uint256 --> itemId

    /* handle inserting / deleting tokens starts */
    mapping(uint256 => Item) internal tokenIdToItem; // uint256 --> tokenId
    mapping(byte32 => mapping(uint256 => Item)) internal collectionToTokenIdToItem; // byte32 --> collection (uuid) | uint256 --> tokenId
    /* handle inserting / deleting tokens ends */
    
    mapping(address => mapping(uint256 => Item)) internal creatorToTokenIdToItem; // address --> msg.sender address | uint256 --> tokenId
    mapping(address => mapping(uint256 => Item)) internal ownerToTokenIdToItem; // address --> msg.sender address | uint256 --> tokenId
    mapping(address => uint256[]) internal creatorTokenIds; // address --> msg.sender address | uint256[] --> tokenIds
    mapping(address => uint256[]) internal ownerTokenIds; // address --> msg.sender address | uint256 --> tokenIds
    mapping(uint256 => address) internal allowance; // uint256 --> tokenid | address --> msg.sender address

    event ItemCreated (
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator
    );

    event ItemsCreated (
        address indexed nftContract,
        uint256[] indexed tokenIds,
        address creator
    );

    event ItemPurchaseTransaction (
        uint256 tokenId,
        address seller,
        address buyer,
        uint256 price
    );

    event ItemNonPurchaseTransaction (
        uint256 tokenId,
        address seller,
        address buyer
    );
 
    event ItemOnMarket(
        uint256 tokenId,
        uint256 price,
        bool isOnSale,
        bool isOnLease,
        bool isOnAuction,
        uint256 startSaleDate,
        uint256 endSaleDate
    );

    event ItemOffMarket(
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
        if (idToItem[itemId].isOnSale || idToItem[itemId].isOnLease || idToItem[itemId].isOnAuction) {
            if (currentDate < idToItem[itemId].startSaleDate || currentDate > idToItem[itemId].endSaleDate) {
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
        idToItem[itemId].price = 0;
        idToItem[itemId].isOnSale = false;
        idToItem[itemId].isOnLease = false;
        idToItem[itemId].isOnAuction = false;
        idToItem[itemId].startSaleDate = 0;
        idToItem[itemId].endSaleDate = 0;
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
 
        Item memory item = Item(
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

        idToItem[itemId] = item;
 
        creatorToTokenIdToItem[msg.sender][tokenId] = item;
        creatorTokenIdsAddTokenId(msg.sender, tokenId);

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
 
        allowance[tokenId] = msg.sender;

        emit ItemCreated(
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

            Item memory item = Item(
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

            idToItem[itemId] = item;

            creatorToTokenIdToItem[msg.sender][tokenId] = item;
            creatorTokenIdsAddTokenId(msg.sender, tokenId);
    
            IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

            allowance[tokenId] = msg.sender;
        }

        emit ItemsCreated(
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
        idToItem[itemId].price = price;
        idToItem[itemId].isOnSale = isOnSale;
        idToItem[itemId].isOnLease = isOnLease;
        idToItem[itemId].isOnAuction = isOnAuction;
        idToItem[itemId].startSaleDate = startSaleDate;
        idToItem[itemId].endSaleDate = endSaleDate;
        address seller = idToItem[itemId].seller;
        if (msg.sender != seller) {
            idToItem[itemId].seller = payable(msg.sender);
        }

        emit ItemOnMarket(
            idToItem[itemId].tokenId,
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
        if (address(0) != idToItem[itemId].seller) {
            idToItem[itemId].seller = payable(address(0));
        }

        emit ItemOffMarket(
            idToItem[itemId].tokenId
        );
    }
    
    /* Transfer ownership from one msg.sender to another */
    function createTransferOwnership(
        address nftContract,
        uint256 itemId,
        address receiver
    ) public payable nonReentrant {
        uint256 tokenId = idToItem[itemId].tokenId;
        address creator = idToItem[itemId].creator;
        address originalOwner = idToItem[itemId].owner;

        // Validation
        require(idToItem[itemId].isOnSale != true, "item on sale");
        require(idToItem[itemId].isOnLease != true, "item on Lease");
        require(idToItem[itemId].isOnAuction != true, "item on Auction");

        // Transferring ownership
        IERC721(nftContract).transferFrom(address(this), receiver, tokenId);
        idToItem[itemId].owner = payable(receiver);

        // Updating ownerToTokenIdToItem nested mapping
        Item storage item = idToItem[itemId];
        // handle originalOwner
        if (originalOwner != address(0)) {
            ownerToTokenIdToItem[originalOwner][tokenId] = Item(
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
        ownerToTokenIdToItem[receiver][tokenId] = item;
        ownerTokenIdsAddTokenId(receiver, tokenId);

        // Clear allowance to creator
        clearItem(itemId);
        if (allowance[tokenId] == creator) {
            allowance[tokenId] = address(0);
        }

        // Emit event
        emit ItemNonPurchaseTransaction(
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
        uint256 price = idToItem[itemId].price;
        uint256 tokenId = idToItem[itemId].tokenId;
        address seller = idToItem[itemId].seller;
        address creator = idToItem[itemId].creator;
        address originalOwner = idToItem[itemId].owner;

        // Validation
        require(msg.value == price, "value incorrect");
        require(idToItem[itemId].isOnSale == true, "item not on sale");
        require(getMarketValid(itemId, currentDate), "not on market");

        // Transfer ownership
        idToItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToItem[itemId].owner = payable(msg.sender);
        clearItem(itemId);
        
        // Transfering sale listing price
        uint256 saleListingRatioNum = (price * (listingRatioNum / listingRatioDen)) * ether_unit;
        payable(owner).transfer(saleListingRatioNum);
        if (allowance[tokenId] == address(this)) {
            allowance[tokenId] = address(0);
        }

        // Updating ownerToTokenIdToItem nested mapping
        Item storage item = idToItem[itemId];
        // handle originalOwner
        if (originalOwner != address(0)) {
            ownerToTokenIdToItem[originalOwner][tokenId] = Item(
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
        ownerToTokenIdToItem[msg.sender][tokenId] = item;
        ownerTokenIdsAddTokenId(originalOwner, tokenId);

        // Clear allowance to creator
        clearItem(itemId);
        if (allowance[tokenId] == creator) {
            allowance[tokenId] = address(0);
        }

        // Emit event
        emit ItemPurchaseTransaction(
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
        address creator = idToItem[itemId].creator;
        address tokenOwner = idToItem[itemId].owner;
        
        // Validation
        require( tokenOwner == msg.sender || allowance[tokenId] == msg.sender );

        Item memory emptyItem = Item(
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

        // Set item in idToItem to non-existing address
        idToItem[itemId] = emptyItem;

        // Set item in creatorToTokenIdToItem to non-existing address
        creatorToTokenIdToItem[creator][tokenId] = emptyItem;
        creatorTokenIdsRemoveTokenId(creator, tokenId);

        // Execute the following code only if the owner of the token exists
        if (tokenOwner != address(0)) {
            // Set item in ownerToTokenIdToItem to non-existing address
            ownerToTokenIdToItem[tokenOwner][tokenId] = emptyItem;
            ownerTokenIdsRemoveTokenId(tokenOwner, tokenId);
        }
    }

    /* Fetchs one token by itemId */
    function fetchItemByItemId(
        uint256 itemId
    ) public view returns (Item memory) {
        Item memory item = idToItem[itemId];
        return item;
    }

    /* Fetches multiple tokens by itemIds */
    function fetchItemsByItemIds(
        uint256[] memory itemIds
    ) public view returns (Item[] memory) {
        Item[] memory items = new Item[](itemIds.length);
        for (uint256 i = 0; i < itemIds.length; i++) {
            uint256 itemId = itemIds[i];
            Item memory item = idToItem[itemId];
            items[i] = item;
        }
        return items;
    }

    function fetchItemByTokenIdAndCreatorAddress(
        uint256 tokenId,
        address creator
    ) public view returns (Item memory) {
        Item memory item = creatorToTokenIdToItem[creator][tokenId];
        return item;        
    }

    function fetchItemsByTokenIdsAndCreatorAddress(
        uint256[] memory tokenIds,
        address creator
    ) public view returns (Item[] memory) {
        Item[] memory items = new Item[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            Item memory item = creatorToTokenIdToItem[creator][tokenIds[i]];
            items[i] = item;
        } 
        return items;
    }

    function fetchUserCreatedItems(
        address user
    ) public view returns (Item[] memory) {        
        uint256[] memory tokenIds = creatorTokenIds[user];
        Item[] memory items = new Item[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            Item memory item = creatorToTokenIdToItem[user][tokenIds[i]];
            items[i] = item;
        }
        return items;
    }
    
    function fetchUserOwnedItems(
        address user
    ) public view returns (Item[] memory) {
        uint256[] memory tokenIds = ownerTokenIds[user];
        Item[] memory items = new Item[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            Item memory item = ownerToTokenIdToItem[user][tokenIds[i]];
            items[i] = item;
        }
        return items;
    }
}