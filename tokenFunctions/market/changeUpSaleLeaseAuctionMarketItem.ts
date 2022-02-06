import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { nftmarketaddress } from '../../config'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

/* Puts the item up for sale / lease / auction */
const changeUpSaleLeaseAuctionMarketItem = async (
  itemId: number,
  price: number,
  isOnSale: boolean,
  isOnLease: boolean,
  isOnAuction: boolean,
  startSaleDate: Date,
  endSaleDate: Date,
) => {
  const startSaleDateAsInt = startSaleDate.getTime()
  const endSaleDateAsInt = endSaleDate.getTime()
  try {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer,
    )
    await marketContract.changeUpSaleLeaseAuctionMarketItem(
      itemId,
      price,
      isOnSale,
      isOnLease,
      isOnAuction,
      startSaleDateAsInt,
      endSaleDateAsInt,
    )
    return true
  } catch (error) {
    console.log(`Error putting item up for sale / lease / auction: `, error)
  }
  return false
}

export default changeUpSaleLeaseAuctionMarketItem
