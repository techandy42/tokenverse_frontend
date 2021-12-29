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

export interface Form {
  name: string
  description: string
  isSensitive: boolean
  topColorOne: string
  topColorTwo: string
  topFeatureOne: string
  topFeatureTwo: string
  domainName: string
  accessLocations: [string, string, string][]
  point: number
  properties: [string, string][]
}

export default function Create() {
  // const [fileUrl, setFileUrl] = useState(null)
  // const [formTextField, updateFormTextField] = useState({
  //   price: '',
  //   name: '',
  //   description: '',
  // })
  const [collection, setCollection] = useState(collections[0])
  const [tokenType, setTokenType] = useState(tokenTypes[0])
  const [blockchainType, setBlockchainType] = useState(blockchainTypes[0])
  const [forms, setForms] = useState<Form[]>([])
  const [fileUrls, setFileUrls] = useState([])
  const [formQuantitySetting, setFormQuantitySetting] = useState(SINGLE)
  const [clearCounter, setClearCounter] = useState(0)

  const router = useRouter()

  const onChangeFile = async (e) => {
    const file = e.target.files[0]
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      })
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrls([...fileUrls, url])
    } catch (e) {
      console.log(e)
    }
  }

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

  const handleClear = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setCollection(collections[0])
    setTokenType(tokenTypes[0])
    setBlockchainType(blockchainTypes[0])
    setFileUrls([])
    setForms([FORM])
    // Triggers the child components to clear their states
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
      <Box sx={{ display: 'flex' }}>
        <Stack
          direction='row'
          spacing={1}
          alignItems='center'
          sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}
        >
          <Typography>Single</Typography>
          <IOSSwitch
            sx={{ m: 1 }}
            onChange={(e) =>
              setFormQuantitySetting(
                formQuantitySetting === SINGLE
                  ? MULTIPLE
                  : formQuantitySetting === MULTIPLE
                  ? SINGLE
                  : SINGLE,
              )
            }
          />
          <Typography>Multiple</Typography>
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={(e) => handleClear()}>Clear All</Button>
      </Box>
      {formQuantitySetting === SINGLE ? (
        <CreateOne
          collection={collection}
          setCollection={setCollection}
          tokenType={tokenType}
          setTokenType={setTokenType}
          blockchainType={blockchainType}
          setBlockchainType={setBlockchainType}
          forms={forms}
          setForms={setForms}
          fileUrls={fileUrls}
          setFileUrls={setFileUrls}
          clearCounter={clearCounter}
        />
      ) : formQuantitySetting === MULTIPLE ? (
        <CreateMany
          collection={collection}
          setCollection={setCollection}
          tokenType={tokenType}
          setTokenType={setTokenType}
          forms={forms}
          setForms={setForms}
          fileUrls={fileUrls}
          setFileUrls={setFileUrls}
        />
      ) : null}
    </StyledPageBase>
  )
}
