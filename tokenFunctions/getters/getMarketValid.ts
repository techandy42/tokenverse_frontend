import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { nftmarketaddress, nftaddress } from '../../config'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

/* Returns whether the token is valid for sale / lease / auction */
const getMarketValid = async (itemId: number, currentDate: Date) => {
  try {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer,
    )
    const currentDateAsInt = currentDate.getTime()
    const isSaleValid = await marketContract.getMarketValid(
      itemId,
      currentDateAsInt,
    )
    return isSaleValid
  } catch (error) {
    console.log('Error getting whether an item is valid for sale: ', error)
  }
  return null
}

export default getMarketValid
