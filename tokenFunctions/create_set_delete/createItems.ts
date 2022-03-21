import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketaddress } from '../../config'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import IData from '../../interfaces/IData'
import isUrlValid from '../../helperFunctions/isUrlValid'

/* Modify the dataFields */

// @ts-ignore
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
//

/* Creates multiple token items */
const createItems = async (dataFieldsList: IData[]) => {
  let fieldsLength = dataFieldsList.length
  let validFields = true
  for (let i = 0; i < fieldsLength; i++) {
    if (
      !isUrlValid(dataFieldsList[i].image) ||
      dataFieldsList[i].name.length === 0
    ) {
      validFields = false
      break
    }
  }
  if (!validFields) return
  const datas: string[] = []
  for (const dataFields of dataFieldsList) {
    const data = JSON.stringify({
      image: dataFields.image,
      animation_url: dataFields.animation_url,
      external_url: dataFields.external_url,
      youtube_url: dataFields.youtube_url,
      description: dataFields.description,
      name: dataFields.name,
      attributes: dataFields.attributes,
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

    let tx = await transactions.wait()
    const tokenIds = []
    for (let i = 0; i < tx.events.length; i = i + 2) {
      const event = tx.events[i]
      const value = event.args[2]
      const tokenId = value.toNumber()
      tokenIds.push(tokenId)
    }
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    transactions = await contract.createMintMarketItems(nftaddress, tokenIds)
    await transactions.wait()
    return tokenIds
  } catch (error) {
    console.log('Error minting tokens: ', error)
  }
  return false
}

export default createItems
