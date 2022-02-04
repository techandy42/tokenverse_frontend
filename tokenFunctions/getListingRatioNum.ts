import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { nftmarketaddress } from '../config'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

/* Fetches the listingRatioNum */
const getListingRatioNum = async () => {
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
  const listingRatioNum = await marketContract.getListingRatioNum()
  return listingRatioNum
}

export default getListingRatioNum
