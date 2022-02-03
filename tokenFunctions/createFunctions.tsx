import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketaddress } from '../config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import {
  BlockchainType,
  SaleType,
  CollectibleCategory,
  ProductKeyRealLifeAssetCategory,
  ProductKeyVirtualAssetCategory,
  ErcType,
} from '../enums/nftMetadata'

// @ts-ignore
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
//

export const getFileUrl = async (file: any) => {
  try {
    const added = await client.add(file, {
      progress: (prog) => console.log(`received: ${prog}`),
    })
    const url = `https://ipfs.infura.io/ipfs/${added.path}`
    return url
  } catch (e) {
    console.log(e)
  }
}

export const createItem = async (
  name: string,
  collection: string,
  blockchainType: BlockchainType,
  fileUrl: string,
  multimedia: any,
  saleType: SaleType,
  collectibleCategory: CollectibleCategory,
  productKeyRealLifeAssetCategory: ProductKeyRealLifeAssetCategory,
  productKeyVirtualAssetCategory: ProductKeyVirtualAssetCategory,
  isSensitiveContent: boolean,
  properties: JSON,
  ercType: ErcType,
) => {
  if (!name || !collection || !blockchainType || !fileUrl) return
  const data = JSON.stringify({
    name,
    collection,
    blockchainType,
    image: fileUrl,
    multimedia,
    saleType,
    collectibleCategory,
    productKeyRealLifeAssetCategory,
    productKeyVirtualAssetCategory,
    isSensitiveContent,
    properties,
    ercType,
  })
  try {
    const added = await client.add(data)
    const url = `https://ipfs.infura.io/ipfs/${added.path}`
    return createSale(url)
  } catch (error) {
    console.log(`Error uploading file: `, error)
  }
}

const createSale = async (url: string) => {
  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()

  let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
  let transaction = await contract.createToken(url)
  let tx = await transaction.wait()
  let event = tx.events[0]
  let value = event.args[2]
  let tokenId = value.toNumber()
  contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
  transaction = await contract.createMintMarketItem(nftaddress, tokenId)
  await transaction.wait()
  return tokenId
}
