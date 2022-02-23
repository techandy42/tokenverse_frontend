import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { nftmarketaddress, nftaddress } from '../../config'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import IItem from '../../interfaces/IItem'
import validateItemsNftContract from '../../helperFunctions/tokenFunctions/validateItemsNftContract'

/* Fetches the token using the given tokenId */
/* returns null if there is an error or no token has been found */
const fetchItemByTokenId = async (tokenId: number, creator: string) => {
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
    let i = await marketContract.fetchItemByTokenIdAndCreatorAddress(
      tokenId,
      creator,
    )
    const validatedI = validateItemsNftContract([i])
    if (validatedI.length === 0) return null
    i = validatedI[0]
    const tokenURI = await tokenContract.tokenURI(i.tokenId)
    const meta = await axios.get(tokenURI)
    let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
    let item: IItem = {
      // token information
      itemId: i.itemId.toNumber(),
      tokenId: i.tokenId.toNumber(),
      nftContract: i.nftContract,
      creator: i.creator,
      seller: i.seller,
      owner: i.owner,
      price,
      isOnSale: i.isOnSale,
      isOnLease: i.isOnLease,
      isOnAuction: i.isOnAuction,
      startSaleDate: new Date(i.startSaleDate.toNumber()),
      endSaleDate: new Date(i.endSaleDate.toNumber()),
      tokenURI,
      // token metadata information
      name: meta.data.name,
      collection: meta.data.collection,
      blockchainType: meta.data.blockchainType,
      fileUrl: meta.data.fileUrl,
      multimedia: meta.data.multimedia,
      saleType: meta.data.saleType,
      collectibleCategory: meta.data.collectibleCategory,
      productKeyAccessTokenCategory: meta.data.productKeyAccessTokenCategory,
      productKeyVirtualAssetCategory: meta.data.productKeyVirtualAssetCategory,
      isSensitiveContent: meta.data.isSensitiveContent,
      ercType: meta.data.ercType,
      descriptions: meta.data.descriptions,
      propertiesKey: meta.data.propertiesKey,
      propertiesValue: meta.data.propertiesValue,
      imagesKey: meta.data.imagesKey,
      imagesValue: meta.data.imagesValue,
      levelsKey: meta.data.levelsKey,
      levelsValueNum: meta.data.levelsValueNum,
      levelsValueDen: meta.data.levelsValueDen,
    }
    return item
  } catch (error) {
    console.log('Error fetching item: ', error)
  }
  return null
}

export default fetchItemByTokenId
