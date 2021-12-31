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
import { SINGLE, MULTIPLE } from '../../constants/values'
import { styled } from '@mui/material/styles'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IOSSwitch from '../components/styles/IOSSwitch'
import tokenTypes from '../../constants/tokenTypes'
import blockchainTypes from '../../constants/blockchainTypes'
import {
  FORM_MARGIN_BOTTOM_VALUE_LARGE,
  FORM_MARGIN_BOTTOM_VALUE_SMALL,
  FORM,
} from '../../constants/values'
import CreateSettings from '../components/CreateSettings'

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

// export interface Form {
//   name: string
//   description: string
//   isSensitive: boolean
//   topColorOne: string
//   topFeatureOne: string
//   topColorTwo: string
//   topFeatureTwo: string
//   domainName: string
//   properties: never[]
//   accessLocations: never[]
//   point: number
//   abilities: never[]
// }

export default function Create() {
  const [isCreateMultiple, setIsCreateMultiple] = useState(false)
  const [collection, setCollection] = useState(collections[0])
  const [tokenType, setTokenType] = useState(tokenTypes[0])
  const [blockchainType, setBlockchainType] = useState(blockchainTypes[0])
  const [forms, setForms] = useState([])
  const [fileUrls, setFileUrls] = useState([])
  const [formQuantitySetting, setFormQuantitySetting] = useState(SINGLE)
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
    setFileUrls([])
    setForms([FORM])
    // Triggers the child components to clear their states
    setClearCounter(clearCounter + 1)
  }

  const StyledPageBase = styled('form')(({ theme }) => ({
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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('form is submitted')
  }

  return (
    <StyledPageBase onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center' }}
          onClick={(e) => setIsCreateMultiple(!isCreateMultiple)}
        >
          <Typography>Single</Typography>
          <Switch
            checked={isCreateMultiple}
            onChange={(e) => setIsCreateMultiple(!isCreateMultiple)}
          />
          <Typography>Multiple</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={handleClear}>Clear All</Button>
      </Box>
      <CreateSettings
        isCreateMultiple={isCreateMultiple}
        collection={collection}
        setCollection={setCollection}
        tokenType={tokenType}
        setTokenType={setTokenType}
        blockchainType={blockchainType}
        setBlockchainType={setBlockchainType}
        fileUrls={fileUrls}
        setFileUrls={setFileUrls}
      />
      {!isCreateMultiple ? (
        <CreateOne
          isCreateMultiple={isCreateMultiple}
          tokenType={tokenType}
          forms={forms}
          setForms={setForms}
          clearCounter={clearCounter}
        />
      ) : (
        <CreateMany
          isCreateMultiple={isCreateMultiple}
          tokenType={tokenType}
          forms={forms}
          setForms={setForms}
          clearCounter={clearCounter}
        />
      )}
      <Button variant='outlined' type='submit'>
        Create Digital Asset
      </Button>
    </StyledPageBase>
  )
}
