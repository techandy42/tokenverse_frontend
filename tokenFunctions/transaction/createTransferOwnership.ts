import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketaddress } from '../../config'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'

/* Creates a transaction of a token without payment */
const createMarketSale = async (itemId: number, tokenId: number) => {
  try {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const transaction = await contract.createMarketSale(nftaddress, itemId)
    await transaction.wait()

    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    await nftContract.changeAllowanceToNullAddress(tokenId)
  } catch (error) {
    console.log('Error creating sale of : ', error)
  }
  return false
}

export default createMarketSale
