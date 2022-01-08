import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { nftmarketaddress, nftaddress } from '../config'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

const loadNFTs = async () => {
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
  const data = await marketContract.fetchUserCreatedItems()
  const items = await Promise.all(
    data.map(async (i: any) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        tokenUri,
        itemId: i.itemId.toNumber(),
        tokenId: i.tokenId.toNumber(),
        creator: i.creator,
        seller: i.seller,
        owner: i.owner,
        price,
        onSale: i.onSale,
        frozen: i.frozen,
        name: meta.data.name,
        collection: meta.data.collection,
        blockchainType: meta.data.blockchainType,
        image: meta.data.image,
        multimedia: meta.data.multimedia,
      }
      return item
    }),
  )
  return items
}

export default loadNFTs
