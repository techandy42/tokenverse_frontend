describe('NFTMarket', function () {
  it('Should create and execute market sales', async function () {
    /* Constant Values for testing */
    const emptyNftAddress = '0x0000000000000000000000000000000000000000'
    const tokenURI1 = 'https://www.mytokenlocation1.com'
    const tokenURI10 = 'https://www.mytokenlocation10.com'
    const tokenURI2 = 'https://www.mytokenlocation2.com'
    const tokenURIs = [
      'https://www.mytokenlocation3.com',
      'https://www.mytokenlocation4.com',
      'https://www.mytokenlocation5.com',
    ]
    const tokenId1 = 1
    const tokenId2 = 2
    const tokenId3 = 3
    const tokenId4 = 4
    const tokenId5 = 5
    const tokenIds345 = [3, 4, 5]
    const itemId1 = 1
    const itemId2 = 2
    const itemId3 = 3
    const itemId4 = 4
    const itemId5 = 5
    const itemIds = [1, 2, 3, 4, 5]
    const startSaleDate = 1000
    const endSaleDate = 1000000

    /* Mutable variables */
    let item = null
    let items = null

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

    /* Creating and Minting Tokens */
    await nft.createToken(tokenURI1)
    await nft.createToken(tokenURI2)

    await nft.createTokens(tokenURIs)

    await market.createMintMarketItem(nftContractAddress, tokenId1)
    await market.createMintMarketItem(nftContractAddress, tokenId2)

    await market.createMintMarketItems(nftContractAddress, tokenIds345)

    /* Change metadata of the token */
    await nft.changeTokenURI(tokenId1, tokenURI10, true)

    /* Put up a token for sale / lease / auction */
    await market.changeUpSaleLeaseAuctionMarketItem(
      itemId1,
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
      itemId2,
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
    await market.changeDownSaleLeaseAuctionMarketItem(itemId2)

    /* Fetching Items from User */
    items = await market.fetchUserItems()
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
          tokenURI,
        }
        return item
      }),
    )
    console.log('items: ', items)

    /* Set-up transaction */
    const [_, buyerAddress] = await ethers.getSigners()

    /* Making sale */
    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, itemId1, { value: auctionPrice })
    await nft.connect(buyerAddress).changeAllowanceToNullAddress(tokenId1)

    /* Burning (deleting) token */
    await nft.connect(buyerAddress).burnToken(tokenId1)
    await market.connect(buyerAddress).deleteItem(itemId1, tokenId1)

    /* Making ownership transfer (non-sale) */
    await market
      .connect(buyerAddress)
      .createTransferOwnership(nftContractAddress, itemId3)
    await nft.connect(buyerAddress).changeAllowanceToNullAddress(tokenId3)

    /* Fetching Items from User */
    items = await market.fetchUserItems()
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
          tokenURI,
        }
        return item
      }),
    )
    console.log('items (fetched user items): ', items)

    /* Fetching Item on Market using itemId */
    let i = await market.fetchItemByItemId(itemId2)
    i = validateItemsNftContract([i])[0]
    let tokenURI = await nft.tokenURI(i.tokenId)
    item = {
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
      tokenURI,
    }
    console.log('item (fetched using itemId): ', item)

    /* Fetching Items on Market using itemIds */
    items = await market.fetchItemsByItemIds(itemIds)
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
          tokenURI,
        }
        return item
      }),
    )
    console.log('items (fetched using itemIds): ', items)

    /* Fetching Item on Market using tokenId */
    i = await market.fetchItemByTokenId(tokenId2)
    i = validateItemsNftContract([i])[0]
    tokenURI = await nft.tokenURI(i.tokenId)
    item = {
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
      tokenURI,
    }
    console.log('item (fetched using tokenId): ', item)

    /* Fetching Items on Market using tokenIds */
    items = await market.fetchItemsByTokenIds(tokenIds345)
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
          tokenURI,
        }
        return item
      }),
    )
    console.log('items (fetched using tokenIds): ', items)
  })
})
