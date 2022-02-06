import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { nftmarketaddress } from '../../config'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

/* Puts the item down from sale / lease / auction */
const changeDownSaleLeaseAuctionMarketItem = async (itemId: number) => {
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
    await marketContract.changeDownSaleLeaseAuctionMarketItem(itemId)
    return true
  } catch (error) {
    console.log(`Error putting item down from sale / lease / auction: `, error)
  }
  return false
}

export default changeDownSaleLeaseAuctionMarketItem
