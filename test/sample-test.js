const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('NFTMarket', function () {
  it('Should create and execute market sales', async function () {
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

    const auctionPrice = ethers.utils.parseUnits('100', 'ether')

    await nft.createToken('https://www.mytokenlocation.com')
    await nft.createToken('https://www.mytokenlocation2.com')

    await market.createMintItem(nftContractAddress, 1)
    await market.createMintItem(nftContractAddress, 2)

    const item1 = await market.createMarketItem(1, 1, auctionPrice, {
      value: listingPrice,
    })
    const item2 = await market.createMarketItem(2, 2, auctionPrice, {
      value: listingPrice,
    })

    console.log(item1)
    console.log(item2)

    // const [_, buyerAddress] = await ethers.getSigners()

    // await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {
    //   value: auctionPrice,
    // })

    // let items = await market.fetchMarketItems()

    // items = await Promise.all(
    //   items.map(async (i) => {
    //     const tokenUri = await nft.tokenURI(i.tokenId)
    //     let item = {
    //       price: i.price.toString(),
    //       tokenId: i.tokenId.toString(),
    //       seller: i.seller,
    //       owner: i.owner,
    //       tokenUri,
    //     }
    //     return item
    //   }),
    // )

    // console.log('items: ', items)
  })
})
