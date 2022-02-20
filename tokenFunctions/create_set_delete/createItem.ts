import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketaddress } from '../../config'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import IData from '../../interfaces/IData'

// @ts-ignore
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
//

/* Creates a token item */
const createItem = async (dataFields: IData) => {
  try {
    if (
      !dataFields.name ||
      !dataFields.collection ||
      !dataFields.blockchainType ||
      !dataFields.fileUrl ||
      !dataFields.ercType
    )
      throw { error: 'dataFields fields are invalid' }
    const data = JSON.stringify({
      name: dataFields.name,
      collection: dataFields.collection,
      blockchainType: dataFields.blockchainType,
      fileUrl: dataFields.fileUrl,
      multimedia: dataFields.multimedia,
      saleType: dataFields.saleType,
      collectibleCategory: dataFields.collectibleCategory,
      productKeyAccessTokenCategory: dataFields.productKeyAccessTokenCategory,
      productKeyVirtualAssetCategory: dataFields.productKeyVirtualAssetCategory,
      isSensitiveContent: dataFields.isSensitiveContent,
      ercType: dataFields.ercType,
      descriptions: dataFields.descriptions,
      propertiesKey: dataFields.propertiesKey,
      propertiesValue: dataFields.propertiesValue,
      imagesKey: dataFields.imagesKey,
      imagesValue: dataFields.imagesValue,
      levelsKey: dataFields.levelsKey,
      levelsValueNum: dataFields.levelsValueNum,
      levelsValueDen: dataFields.levelsValueDen,
    })
    const added = await client.add(data)
    const url = `https://ipfs.infura.io/ipfs/${added.path}`
    return createMintMarketItem(url)
  } catch (error) {
    console.log(`Error uploading file: `, error)
  }
}

/* Helper function to mint the token */
const createMintMarketItem = async (url: string) => {
  try {
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
  } catch (error) {
    console.log('Error minting token: ', error)
  }
  return -1
}

export default createItem
