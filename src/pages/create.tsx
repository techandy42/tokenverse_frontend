import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketaddress } from '../../config'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import CreateOne from '../components/CreateOne'
import CreateMany from '../components/CreateMany'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import tokenTypes from '../../constants/tokenTypes'
import blockchainTypes from '../../constants/blockchainTypes'
import {
  FORM_MARGIN_BOTTOM_VALUE_LARGE,
  CREATE_ONE,
  CREATE_MANY,
  CREATE_SFT,
} from '../../constants/values'
import CreateSettings from '../components/CreateSettings'
import FlexBox from '../components/styles/FlexBox'
import FlexSpace from '../components/styles/FlexSpace'
import { ButtonGroup, ToggleButton, ToggleButtonGroup } from '@mui/material'
import CreateSFT from '../components/CreateSFT'
import { FORM } from '../../constants/values'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

// fetch collections from the back-end
// example:
const newlyGeneratedCollection = 'random-collection-#1234567890'
export const collections = [
  newlyGeneratedCollection,
  'Collection 1',
  'Collection 2',
  'Collection 3',
]

export default function Create() {
  const [createType, setCreateType] = useState(CREATE_ONE)
  const [collection, setCollection] = useState(collections[0])
  const [tokenType, setTokenType] = useState(tokenTypes[0])
  const [blockchainType, setBlockchainType] = useState(blockchainTypes[0])
  const [clearCounter, setClearCounter] = useState(0)

  const router = useRouter()

  // async function createItem() {
  //   const { name, description, price } = formTextField
  //   if (!name || !description || !price || !fileUrl) return
  //   const data = JSON.stringify({
  //     name,
  //     description,
  //     image: fileUrl,
  //   })

  //   try {
  //     const added = await client.add(data)
  //     const url = `https://ipfs.infura.io/ipfs/${added.path}`
  //     createSale(url)
  //   } catch (error) {
  //     console.log(`Error uploading file: `, error)
  //   }
  // }

  // async function createSale(url) {
  //   const web3Modal = new Web3Modal()
  //   const connection = await web3Modal.connect()
  //   const provider = new ethers.providers.Web3Provider(connection)
  //   const signer = provider.getSigner()

  //   let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
  //   let transaction = await contract.createToken(url)
  //   let tx = await transaction.wait()

  //   let event = tx.events[0]
  //   let value = event.args[2]
  //   let tokenId = value.toNumber()

  //   const price = ethers.utils.parseUnits(formTextField.price, 'ether')

  //   contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
  //   let listingPrice = await contract.getListingPrice()
  //   listingPrice = listingPrice.toString()

  //   transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
  //     value: listingPrice,
  //   })
  //   await transaction.wait()
  //   router.push('/')
  // }

  const handleClear = (e) => {
    setCollection(collections[0])
    setTokenType(tokenTypes[0])
    setBlockchainType(blockchainTypes[0])
    setClearCounter(clearCounter + 1)
  }

  const StyledPageBase = styled('div')(({ theme }) => ({
    marginTop: FORM_MARGIN_BOTTOM_VALUE_LARGE,
    marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE,
    marginLeft: '5%',
    marginRight: '5%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: '10%',
      marginRight: '10%',
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: '20%',
      marginRight: '20%',
    },
  }))

  return (
    <StyledPageBase>
      <FlexBox>
        <ToggleButtonGroup color='primary' value={createType} exclusive>
          <ToggleButton
            value={CREATE_ONE}
            onClick={(e) => setCreateType(CREATE_ONE)}
          >
            Create Single
          </ToggleButton>
          <ToggleButton
            value={CREATE_MANY}
            onClick={(e) => setCreateType(CREATE_MANY)}
          >
            Create Multiple
          </ToggleButton>
          <ToggleButton
            value={CREATE_SFT}
            onClick={(e) => setCreateType(CREATE_SFT)}
          >
            Create SFT
          </ToggleButton>
        </ToggleButtonGroup>
        <FlexSpace />
        <Button onClick={handleClear}>Clear All</Button>
      </FlexBox>
      {createType !== CREATE_SFT && (
        <CreateSettings
          createType={createType}
          collection={collection}
          setCollection={setCollection}
          tokenType={tokenType}
          setTokenType={setTokenType}
          blockchainType={blockchainType}
          setBlockchainType={setBlockchainType}
        />
      )}
      {createType === CREATE_ONE ? (
        <CreateOne
          collection={collection}
          tokenType={tokenType}
          blockchainType={blockchainType}
          clearCounter={clearCounter}
          // form={form}
          // setForm={setForm}
          // file={file}
          // setFile={setFile}
          // multimediaImageFile={multimediaImageFile}
          // setMultimediaImageFile={setMultimediaImageFile}
        />
      ) : createType === CREATE_MANY ? (
        <CreateMany
          collection={collection}
          tokenType={tokenType}
          blockchainType={blockchainType}
          clearCounter={clearCounter}
        />
      ) : createType === CREATE_SFT ? (
        <CreateSFT />
      ) : null}
    </StyledPageBase>
  )
}
