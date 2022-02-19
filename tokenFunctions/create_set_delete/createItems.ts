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

/* Creates multiple token items */
const createItems = async (dataFieldsList: IData[]) => {
  let fieldsLength = dataFieldsList.length
  let validFields = true
  for (let i = 0; i < fieldsLength; i++) {
    if (
      !dataFieldsList[i].name ||
      !dataFieldsList[i].collection ||
      !dataFieldsList[i].blockchainType ||
      !dataFieldsList[i].fileUrl ||
      !dataFieldsList[i].ercType
    ) {
      validFields = false
      break
    }
  }
  if (!validFields) return
  const datas: string[] = []
  for (const dataFields of dataFieldsList) {
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
    datas.push(data)
  }
  try {
    const urls: string[] = []
    for (const data of datas) {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      urls.push(url)
    }
    return createMintMarketItems(urls)
  } catch (error) {
    console.log(`Error uploading file: `, error)
  }
}

/* Helper function to mint the tokens */
const createMintMarketItems = async (urls: string[]) => {
  try {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transactions = await contract.createTokens(urls)
    // Make this plural instead of singular
    // Complete this section when writing the front-end code

    // let tx = await transaction.wait()
    // let event = tx.events[0]
    // let value = event.args[2]
    // let tokenId = value.toNumber()
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    // transaction = await contract.createMintMarketItems(nftaddress, tokenId)
    // await transaction.wait()
    // return tokenId
  } catch (error) {
    console.log('Error minting tokens: ', error)
  }
  return -1
}

export default createItems
