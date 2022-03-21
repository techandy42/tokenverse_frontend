import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { nftmarketaddress, nftaddress } from '../../config'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import validateItemsNftContract from '../../helperFunctions/tokenFunctions/validateItemsNftContract'
import formatItem from '../../helperFunctions/tokenFunctions/formatItem'

/* Fetches the token using the given itemId */
/* returns null if there is an error or no token has been found */
const fetchItemByItemId = async (itemId: number) => {
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
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    let i = await marketContract.fetchItemByItemId(itemId)
    const validatedI = validateItemsNftContract([i])
    if (validatedI.length === 0) return null
    i = validatedI[0]
    const tokenURI = await tokenContract.tokenURI(i.tokenId)
    const meta = await axios.get(tokenURI)
    let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
    return formatItem(i, meta, price, tokenURI)
  } catch (error) {
    console.log('Error fetching item: ', error)
  }
  return null
}

export default fetchItemByItemId
