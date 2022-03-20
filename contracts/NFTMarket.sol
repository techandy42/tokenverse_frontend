/* Handles the following
 * Minting
 * Deleting 
 * Selling
 * Transferring
 * Fetching
 */

/*
 * collection (uuid): 36 character string
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
    string constant emptyCollection = "00000000-0000-0000-0000-000000000000"; // empty uuid
    enum ItemType{ CREATE, EMPTY }

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }
 
    struct Item {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        string collection;
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

    mapping(uint256 => uint256) internal tokenIdToId; // uint256 --> tokenId | uint256 --> itemId
    mapping(string => uint256[]) internal collectionToIds; // string --> collection (uuid) | uint256[] --> itemId[]
    mapping(address => uint256[]) internal creatorToIds; // address --> msg.sender address | uint256[] --> itemId[]
    mapping(address => uint256[]) internal ownerToIds; // address --> msg.sender address | uint256[] --> itemId[]

    mapping(uint256 => address) internal allowance; // uint256 --> tokenid | address --> msg.sender address

    event ItemCreated (
        address indexed _nftContract,
        uint256 indexed _tokenId,
        address _creator
    );

    event ItemsCreated (
        address indexed _nftContract,
        uint256[] indexed _tokenIds,
        address _creator
    );

    event ItemPurchaseTransaction (
        uint256 _tokenId,
        address _seller,
        address _buyer,
        uint256 _price
    );

    event ItemNonPurchaseTransaction (
        uint256 _tokenId,
        address _seller,
        address _buyer
    );
 
    event ItemOnMarket(
        uint256 _tokenId,
        uint256 _price,
        bool _isOnSale,
        bool _isOnLease,
        bool _isOnAuction,
        uint256 _startSaleDate,
        uint256 _endSaleDate
    );

    event ItemOffMarket(
        uint256 _tokenId
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

    /* returns item */
    function getItem(
        uint256 itemId,
        address nftContract,
        uint256 tokenId,
        string memory collection,
        ItemType itemType
    ) private view returns (Item memory) {
        if (itemType == ItemType.CREATE) {
            return Item(
                itemId,
                nftContract,
                tokenId,
                collection,
                payable(msg.sender),
                payable(address(0)),
                payable(address(0)),
                0,
                false,
                false,
                false,
                0,
                0
            );
        } else {
            // ItemType.empty
            return Item(
                itemId,
                address(0),
                tokenId,
                collection,
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

    /* Add a itemId to a address in creatorToIds */
    function collectionToIdsAddId(
        string memory collection,
        uint256 itemId
    ) private {
        uint256[] storage itemIds = collectionToIds[collection];
        itemIds.push(itemId);
        collectionToIds[collection] = itemIds;
    }
    
    /* Remove a itemId to a address in collectionToIds (sets it to 0) */
    function collectionToIdsRemoveId(
        string memory collection,
        uint256 itemId
    ) private {
        uint256[] storage itemIds = collectionToIds[collection];
        uint256 index = itemIds.length; 
        for (uint256 i = 0; i < itemIds.length; i++) {
            if (itemIds[i] == itemId) {
                index = i;
            }
        }
        if (index != itemIds.length) {
            itemIds[index] = itemIds[itemIds.length - 1];
            itemIds.pop();
        }
        collectionToIds[collection] = itemIds;
    }

    /* Add a itemId to a address in creatorToIds */
    function creatorToIdsAddId(
        address creator,
        uint256 itemId
    ) private {
        uint256[] storage itemIds = creatorToIds[creator];
        itemIds.push(itemId);
        creatorToIds[creator] = itemIds;
    }
    
    /* Remove a itemId to a address in creatorToIds (sets it to 0) */
    function creatorToIdsRemoveId(
        address creator,
        uint256 itemId
    ) private {
        uint256[] storage itemIds = creatorToIds[creator];
        uint256 index = itemIds.length; 
        for (uint256 i = 0; i < itemIds.length; i++) {
            if (itemIds[i] == itemId) {
                index = i;
            }
        }
        if (index != itemIds.length) {
            itemIds[index] = itemIds[itemIds.length - 1];
            itemIds.pop();
        }
        creatorToIds[creator] = itemIds;
    }
    
    /* Add a itemId to a address in ownerToIds */
    function ownerToIdsAddId(
        address tokenOwner,
        uint256 itemId
    ) private {
        uint256[] storage itemIds = ownerToIds[tokenOwner];
        itemIds.push(itemId);
        ownerToIds[tokenOwner] = itemIds;        
    }
    
    /* Remove a itemId to a address in ownerToIds (sets it to 0) */
    function ownerToIdsRemoveId(
        address tokenOwner,
        uint256 itemId
    ) private {
        uint256[] storage itemIds = ownerToIds[tokenOwner];
        uint256 index = itemIds.length; 
        for (uint256 i = 0; i < itemIds.length; i++) {
            if (itemIds[i] == itemId) {
                index = i;
            }
        }
        if (index != itemIds.length) {
            itemIds[index] = itemIds[itemIds.length - 1];
            itemIds.pop();
        }
        ownerToIds[tokenOwner] = itemIds;
    }

    /* Mints one token */
    function createMintMarketItem(
        address nftContract,
        uint256 tokenId,
        string memory collection
    ) public payable nonReentrant {
        _itemIds.increment();
        uint256 itemId = _itemIds.current();
 
        Item memory item = getItem(itemId, nftContract, tokenId, collection, ItemType.CREATE);

        idToItem[itemId] = item;
 
        tokenIdToId[tokenId] = itemId;
        collectionToIdsAddId(collection, itemId);
        creatorToIdsAddId(msg.sender, itemId);

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
        uint256[] memory tokenIds,
        string memory collection
    ) public payable nonReentrant {

        for (uint256 i = 0; i < tokenIds.length; i++) {
            _itemIds.increment();
            uint256 itemId = _itemIds.current();
            uint256 tokenId = tokenIds[i];

            Item memory item = getItem(itemId, nftContract, tokenId, collection, ItemType.CREATE);

            idToItem[itemId] = item;

            tokenIdToId[tokenId] = itemId;
            collectionToIdsAddId(collection, itemId);            
            creatorToIdsAddId(msg.sender, itemId);
    
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
        // price 0 or less
        require(price > 0, "p0ol");
        // price not same as listed ratio num
        require(msg.value == listingRatioNum, "pnsalrn");

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
        // item on sale
        require(idToItem[itemId].isOnSale != true, "ios");
        // item on lease
        require(idToItem[itemId].isOnLease != true, "iol");
        // item on auction
        require(idToItem[itemId].isOnAuction != true, "ioa");

        // Transferring ownership
        IERC721(nftContract).transferFrom(address(this), receiver, tokenId);
        idToItem[itemId].owner = payable(receiver);

        if (originalOwner != address(0)) {
            ownerToIdsRemoveId(originalOwner, itemId);
        }

        ownerToIdsAddId(receiver, itemId);

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
        // value incorrect
        require(msg.value == price, "vi");
        // item not on sale
        require(idToItem[itemId].isOnSale == true, "inos");
        // not on market
        require(getMarketValid(itemId, currentDate), "nom");

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

        if (originalOwner != address(0)) {
            ownerToIdsRemoveId(originalOwner, itemId);
        }

        ownerToIdsAddId(msg.sender, itemId);

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
        uint256 itemId
    ) public payable nonReentrant {
        uint256 tokenId = idToItem[itemId].tokenId;
        address creator = idToItem[itemId].creator;
        address tokenOwner = idToItem[itemId].owner;
        string memory collection = idToItem[itemId].collection;

        // Validation
        require( tokenOwner == msg.sender || allowance[tokenId] == msg.sender );

        Item memory emptyItem = getItem(itemId, address(0), tokenId, emptyCollection, ItemType.EMPTY);

        // Set item in idToItem to non-existing address
        idToItem[itemId] = emptyItem;

        collectionToIdsRemoveId(collection, itemId);
        creatorToIdsRemoveId(creator, itemId);

        if (tokenOwner != address(0)) {
            ownerToIdsRemoveId(tokenOwner, itemId);
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

    function fetchItemByTokenId(
        uint256 tokenId
    ) public view returns (Item memory) {
        uint256 itemId = tokenIdToId[tokenId];
        Item memory item = idToItem[itemId];
        return item;        
    }

    function fetchItemsByTokenIds(
        uint256[] memory tokenIds
    ) public view returns (Item[] memory) {
        Item[] memory items = new Item[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 itemId = tokenIdToId[tokenIds[i]];
            Item memory item = idToItem[itemId];
            items[i] = item;
        }
        return items;
    }

    function fetchItemsByCollection(
        string memory collection
    ) public view returns (Item[] memory) {        
        uint256[] memory itemIds = collectionToIds[collection];
        Item[] memory items = new Item[](itemIds.length);
        for (uint256 i = 0; i < itemIds.length; i++) {
            Item memory item = idToItem[i];
            items[i] = item;
        }
        return items;
    }

    function fetchUserCreatedItems(
        address user
    ) public view returns (Item[] memory) {        
        uint256[] memory itemIds = creatorToIds[user];
        Item[] memory items = new Item[](itemIds.length);
        for (uint256 i = 0; i < itemIds.length; i++) {
            Item memory item = idToItem[i];
            items[i] = item;
        }
        return items;
    }
    
    function fetchUserOwnedItems(
        address user
    ) public view returns (Item[] memory) {
        uint256[] memory itemIds = ownerToIds[user];
        Item[] memory items = new Item[](itemIds.length);
        for (uint256 i = 0; i < itemIds.length; i++) {
            Item memory item = idToItem[i];
            items[i] = item;
        }
        return items;
    }
}