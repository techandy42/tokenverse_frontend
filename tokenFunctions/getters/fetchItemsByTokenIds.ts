import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { nftmarketaddress, nftaddress } from '../../config'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import IItem from '../../interfaces/IItem'
import validateItemsNftContract from '../../helperFunctions/tokenFunctions/validateItemsNftContract'
import formatItem from '../../helperFunctions/tokenFunctions/formatItem'

/* Fetches the tokens using the given tokenIds */
/* returns null if there is an error or no tokens has been found */
const fetchItemByTokenIds = async (tokenIds: number[]) => {
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
    let iList = await marketContract.fetchItemsByTokenIds(tokenIds)
    const validatedIList = validateItemsNftContract(iList)
    if (validatedIList.length === 0) return null
    iList = validatedIList
    const items: IItem[] = await Promise.all(
      iList.map(async (i: any) => {
        const tokenURI = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenURI)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        return formatItem(i, meta, price, tokenURI)
      }),
    )
    return items
  } catch (error) {
    console.log('Error fetching items: ', error)
  }
  return null
}

export default fetchItemByTokenIds
