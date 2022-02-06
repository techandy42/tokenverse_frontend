import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { nftaddress } from '../../config'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'

/* Changes the tokenURI of a token in NFT contract */
const changeTokenURI = async (
  tokenId: number,
  newTokenURI: string,
  isMetadataFrozen: boolean,
) => {
  try {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    await nftContract.changeTokenURI(tokenId, newTokenURI, isMetadataFrozen)
    return true
  } catch (error) {
    console.log("Error changing token's tokenURI")
  }
  return false
}

export default changeTokenURI
