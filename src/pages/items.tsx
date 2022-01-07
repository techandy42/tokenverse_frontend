import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { nftaddress, nftmarketaddress } from '../../config'

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider,
    )
    const data = await marketContract.fetchMarketItems()

    // find the type
    const items = await Promise.all(
      data.map(async (i: any) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          itemId: i.itemId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        }
        return item
      }),
    )
    setNfts(items)
    setLoadingState('loaded')
  }

  // find the type
  async function buyNft(nft: any) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.itemId,
      {
        value: price,
      },
    )
    await transaction.wait()
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length)
    return <h1 className='px-20 py-10 text-3xl'>No items in marketplace</h1>
  return (
    <div>
      <div style={{ maxWidth: '1600px' }}>
        <div>
          {nfts.map((nft, i) => (
            <div key={i}>
              <img src={nft.image} />
              <div>
                <p style={{ height: '64px' }}>{nft.name}</p>
                <div style={{ height: '70px', overflow: 'hidden' }}>
                  <p>{nft.description}</p>
                </div>
              </div>
              <div>
                <p>{nft.price} ETH</p>
                <button onClick={() => buyNft(nft)}>Buy</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
