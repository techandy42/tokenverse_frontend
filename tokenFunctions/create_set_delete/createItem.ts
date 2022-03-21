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

/* Creates a token item */
const createItem = async (dataFields: IData) => {
  try {
    if (!isUrlValid(dataFields.image) || dataFields.name.length === 0)
      throw { error: 'dataFields fields are invalid' }
    const data = JSON.stringify({
      image: dataFields.image,
      animation_url: dataFields.animation_url,
      external_url: dataFields.external_url,
      youtube_url: dataFields.youtube_url,
      description: dataFields.description,
      name: dataFields.name,
      attributes: dataFields.attributes,
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
