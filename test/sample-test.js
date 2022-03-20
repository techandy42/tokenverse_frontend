describe('NFTMarket', function () {
  it('Should create and execute market sales', async function () {
    /* Constant Values for testing */
    const emptyNftAddress = '0x0000000000000000000000000000000000000000'
    const tokenURIs = [
      'https://www.mytokenlocation1.com',
      'https://www.mytokenlocation2.com',
      'https://www.mytokenlocation3.com',
      'https://www.mytokenlocation4.com',
      'https://www.mytokenlocation5.com',
    ]
    const tokenURIs10 = [
      'https://www.mytokenlocation10.com',
      'https://www.mytokenlocation20.com',
      'https://www.mytokenlocation30.com',
      'https://www.mytokenlocation40.com',
      'https://www.mytokenlocation50.com',
    ]
    const tokenIds = [1, 2, 3, 4, 5]
    const itemIds = [1, 2, 3, 4, 5]
    const startSaleDate = 1000
    const currentDate = 10000
    const endSaleDate = 100000
    const uuid1 = '16267d85-e6a3-4ce8-bd00-7395473e2b18'
    const uuid2 = '17dc7a67-9067-4683-817c-ea35c25e116d'

    // pseudo-enums
    const IdType = {
      itemId: 'ITEM_ID',
      tokenId: 'TOKEN_ID',
    }
    const AddressType = {
      creator: 'CREATOR',
      owner: 'OWNER',
    }

    /* Helper functions */
    const validateItemsNftContract = (items) => {
      const validItems = []
      for (let i = 0; i < items.length; i++) {
        if (items[i].nftContract !== emptyNftAddress) {
          validItems.push(items[i])
        }
      }
      return validItems
    }

    /* Getter Functions */
    const getItemById = async (id, idType) => {
      let i
      if (idType === IdType.itemId) {
        i = await market.fetchItemByItemId(id)
      } else if (idType === IdType.tokenId) {
        i = await market.fetchItemByTokenId(id)
      } else {
        return
      }
      i = validateItemsNftContract([i])[0]
      let tokenURI = await nft.tokenURI(i.tokenId)
      const item = {
        itemId: i.itemId.toString(),
        nftContract: i.nftContract,
        tokenId: i.tokenId.toString(),
        creator: i.creator,
        seller: i.seller,
        owner: i.owner,
        price: i.price.toString(),
        isOnSale: i.isOnSale,
        isOnLease: i.isOnLease,
        isOnAuction: i.isOnAuction,
        startSaleDate: i.startSaleDate.toString(),
        endSaleDate: i.endSaleDate.toString(),
        collection: i.collection,
        tokenURI,
      }
      console.log(`item (fetched using ${idType}): `, item)
    }

    const getItemsByIds = async (ids, idType) => {
      let items
      if (idType === IdType.itemId) {
        items = await market.fetchItemsByItemIds(ids)
      } else if (idType === IdType.tokenId) {
        items = await market.fetchItemsByTokenIds(ids)
      } else {
        return
      }
      items = validateItemsNftContract(items)
      items = await Promise.all(
        items.map(async (i) => {
          const tokenURI = await nft.tokenURI(i.tokenId)
          let item = {
            itemId: i.itemId.toString(),
            nftContract: i.nftContract,
            tokenId: i.tokenId.toString(),
            creator: i.creator,
            seller: i.seller,
            owner: i.owner,
            price: i.price.toString(),
            isOnSale: i.isOnSale,
            isOnLease: i.isOnLease,
            isOnAuction: i.isOnAuction,
            startSaleDate: i.startSaleDate.toString(),
            endSaleDate: i.endSaleDate.toString(),
            collection: i.collection,

            tokenURI,
          }
          return item
        }),
      )
      console.log(`item (fetched using ${idType}): `, items)
    }

    const getItemsByAddress = async (address, addressType, varName) => {
      let items
      if (addressType === AddressType.creator) {
        items = await market.fetchUserCreatedItems(address)
      } else if (addressType === AddressType.owner) {
        items = await market.fetchUserOwnedItems(address)
      } else {
        return
      }
      items = validateItemsNftContract(items)
      items = await Promise.all(
        items.map(async (i) => {
          const tokenURI = await nft.tokenURI(i.tokenId)
          let item = {
            itemId: i.itemId.toString(),
            nftContract: i.nftContract,
            tokenId: i.tokenId.toString(),
            creator: i.creator,
            seller: i.seller,
            owner: i.owner,
            price: i.price.toString(),
            isOnSale: i.isOnSale,
            isOnLease: i.isOnLease,
            isOnAuction: i.isOnAuction,
            startSaleDate: i.startSaleDate.toString(),
            endSaleDate: i.endSaleDate.toString(),
            collection: i.collection,
            tokenURI,
          }
          return item
        }),
      )
      console.log(
        `item (fetched using ${addressType} | varName: ${varName}): `,
        items,
      )
    }

    const getItemsByCollection = async (collection, varName) => {
      let items = await market.fetchItemsByCollection(collection)
      items = validateItemsNftContract(items)
      items = await Promise.all(
        items.map(async (i) => {
          const tokenURI = await nft.tokenURI(i.tokenId)
          let item = {
            itemId: i.itemId.toString(),
            nftContract: i.nftContract,
            tokenId: i.tokenId.toString(),
            creator: i.creator,
            seller: i.seller,
            owner: i.owner,
            price: i.price.toString(),
            isOnSale: i.isOnSale,
            isOnLease: i.isOnLease,
            isOnAuction: i.isOnAuction,
            startSaleDate: i.startSaleDate.toString(),
            endSaleDate: i.endSaleDate.toString(),
            collection: i.collection,
            tokenURI,
          }
          return item
        }),
      )
      console.log(
        `item (fetched using COLLECTION  | varName: ${varName}): `,
        items,
      )
    }

    const getCreator = async () => {
      let items = await market.fetchItemsByItemIds(itemIds)
      items = validateItemsNftContract(items)
      items = await Promise.all(
        items.map(async (i) => {
          const tokenURI = await nft.tokenURI(i.tokenId)
          let item = {
            itemId: i.itemId.toString(),
            nftContract: i.nftContract,
            tokenId: i.tokenId.toString(),
            creator: i.creator,
            seller: i.seller,
            owner: i.owner,
            price: i.price.toString(),
            isOnSale: i.isOnSale,
            isOnLease: i.isOnLease,
            isOnAuction: i.isOnAuction,
            startSaleDate: i.startSaleDate.toString(),
            endSaleDate: i.endSaleDate.toString(),
            collection: i.collection,
            tokenURI,
          }
          return item
        }),
      )
      return items[0].creator
    }

    /* Set-up */
    const Market = await ethers.getContractFactory('NFTMarket')
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    const NFT = await ethers.getContractFactory('NFT')
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    let listingRatioNum = await market.getListingRatioNum()
    listingRatioNum = listingRatioNum.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    /* Set-up transaction */
    const [_, buyerAddress] = await ethers.getSigners()

    /* Creating and Minting Tokens */
    await nft.createToken(tokenURIs[0])
    await nft.createToken(tokenURIs[1])

    await nft.createTokens(tokenURIs.slice(2, 5))

    await market.createMintMarketItem(nftContractAddress, tokenIds[0], uuid1)
    await market.createMintMarketItem(nftContractAddress, tokenIds[1], uuid2)

    await market.createMintMarketItems(
      nftContractAddress,
      tokenIds.slice(2, 5),
      uuid1,
    )

    /* Fetched creator of the tokens */
    const user1 = getCreator()
    const user2 = buyerAddress.address

    /* Change metadata of the token */
    await nft.changeTokenURI(tokenIds[2], tokenURIs10[2])

    /* Freeze metadata of the token */
    await nft.freezeTokenURI(tokenIds[2], tokenURIs10[2])

    /* Put up a token for sale / lease / auction */
    await market.changeUpSaleLeaseAuctionMarketItem(
      itemIds[0],
      auctionPrice,
      true,
      true,
      true,
      startSaleDate,
      endSaleDate,
      {
        value: listingRatioNum,
      },
    )

    /* Put up a token for sale / lease / auction */
    /* Put down a token from sale / lease / auction */
    await market.changeUpSaleLeaseAuctionMarketItem(
      itemIds[1],
      auctionPrice,
      true,
      true,
      true,
      startSaleDate,
      endSaleDate,
      {
        value: listingRatioNum,
      },
    )
    await market.changeDownSaleLeaseAuctionMarketItem(itemIds[1])

    /* Put up a token for sale / lease / auction */
    await market.changeUpSaleLeaseAuctionMarketItem(
      itemIds[3],
      auctionPrice,
      true,
      false,
      false,
      startSaleDate,
      endSaleDate,
      {
        value: listingRatioNum,
      },
    )

    /* Making sale */
    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, itemIds[0], currentDate, {
        value: auctionPrice,
      })
    await nft.connect(buyerAddress).changeAllowanceToNullAddress(tokenIds[0])

    /* Burning (deleting) token */
    await nft.connect(buyerAddress).burnToken(tokenIds[0])
    await market.connect(buyerAddress).deleteItem(itemIds[0])

    /* Making ownership transfer (non-sale) */
    await market.createTransferOwnership(
      nftContractAddress,
      itemIds[2],
      buyerAddress.address,
    )
    await nft.connect(buyerAddress).changeAllowanceToNullAddress(tokenIds[2])

    /* Fetching Item on Market using itemId */
    getItemById(itemIds[2], IdType.itemId)

    /* Fetching Items on Market using itemIds */
    getItemsByIds(itemIds, IdType.itemId)

    /* Fetching Item on Market using tokenId */
    getItemById(tokenIds[2], IdType.tokenId)

    /* Fetching Items on Market using tokenIds */
    getItemsByIds(tokenIds, IdType.tokenId)

    /* Fetching Items from User (Creator) */
    getItemsByAddress(user1, AddressType.creator, 'user1')

    /* Fetching Items from User (Creator) */
    getItemsByAddress(user2, AddressType.creator, 'user2')

    /* Fetching Items from User (Owner) */
    getItemsByAddress(user1, AddressType.owner, 'user1')

    /* Fetching Items from User (Owner) */
    getItemsByAddress(user2, AddressType.owner, 'user2')

    /* Fetching Items from collection */
    getItemsByCollection(uuid1, 'uuid1')

    /* Fetching Items from collection */
    getItemsByCollection(uuid2, 'uuid2')
  })
})
