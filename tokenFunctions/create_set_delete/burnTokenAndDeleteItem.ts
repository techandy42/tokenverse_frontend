import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketaddress } from '../../config'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

/* Creates a token item */
const burnTokenAndDeleteItem = async (itemId: number, tokenId: number) => {
  const resultBurnToken = await burnToken(tokenId)
  const resultDeleteItem = await deleteItem(itemId, tokenId)
  if (resultBurnToken && resultDeleteItem) {
    return true
  }
  return false
}

/* Burn Token in NFT Contract */
const burnToken = async (tokenId: number) => {
  try {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    await nftContract.burnToken(tokenId)
    return true
  } catch (error) {
    console.log(`Error burning and deleting the token/item: `, error)
  }
  return false
}

/* Delete Item in NFTMarket Contract */
const deleteItem = async (itemId: number, tokenId: number) => {
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
    await marketContract.deleteItem(itemId, tokenId)
    return true
  } catch (error) {
    console.log(`Error burning and deleting the token/item: `, error)
  }
  return false
}

export default burnTokenAndDeleteItem
