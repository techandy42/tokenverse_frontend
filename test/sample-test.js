describe('NFTMarket', function () {
  it('Should create and execute market sales', async function () {
    // Set-Up
    const Market = await ethers.getContractFactory('NFTMarket')
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    const NFT = await ethers.getContractFactory('NFT')
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    // Create and Change Functions (Minting and Putting Token on Sale)
    await nft.createToken('https://www.mytokenlocation.com')
    await nft.createToken('https://www.mytokenlocation2.com')

    await market.createMintMarketItem(nftContractAddress, 1)
    await market.createMintMarketItem(nftContractAddress, 2)

    await nft.changeTokenIdToken(1, 'https://www.mytokenlocation3.com')
    await market.changeSaleMarketItem(1, auctionPrice, { value: listingPrice })

    let item = null
    let items = null

    // Fetching Items on Market #1
    items = await market.fetchMarketItems()
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId)
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        }
        return item
      }),
    )
    console.log('items: ', items)

    // Making Transaction
    const [_, buyerAddress] = await ethers.getSigners()

    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, 1, { value: auctionPrice })

    // Fetching Items on Market #2
    items = await market.fetchMarketItems()
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId)
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        }
        return item
      }),
    )
    console.log('items: ', items)

    // Fetching Item on Market using itemId
    const itemId = 1
    item = await market.fetchMarketItemByItemId(itemId)
    const itemTokenUri = await nft.tokenURI(item.tokenId)
    item = {
      price: item.price.toString(),
      tokenId: item.tokenId.toString(),
      seller: item.seller,
      owner: item.owner,
      itemTokenUri,
    }
    console.log('item (fetched using itemId): ', item)

    // Fetching Items on Market using itemIds
    const itemIds = [1]
    items = await market.fetchMarketItemsByItemIds(itemIds)
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId)
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        }
        return item
      }),
    )
    console.log('items (fetched using itemIds): ', items)

    // Fetching User Puchased Items
    items = await market.fetchUserPurchasedItems()
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId)
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        }
        return item
      }),
    )
    console.log('items (user purchased): ', items)

    // Issue: if items is empty, Promise.all(...) will throw an error

    // Fetching User Not Sale Items
    items = await market.fetchUserCreatedNotSaleItems()
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId)
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        }
        return item
      }),
    )
    console.log('items (user not sale): ', items)

    // Fetching User Sale Items
    items = await market.fetchUserCreatedSaleItems()
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId)
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        }
        return item
      }),
    )
    console.log('items (user sale): ', items)

    // // Fetching User Sold Items
    items = await market.fetchUserCreatedSoldItems()
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId)
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        }
        return item
      }),
    )
    console.log('items (user sold): ', items)
  })
})
