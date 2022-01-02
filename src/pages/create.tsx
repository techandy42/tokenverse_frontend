import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketaddress } from '../../config'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import {
  MARGIN_LARGE,
  CREATE_SINGLE,
  CREATE_MULTIPLE,
  CREATE_SFT,
  IMPORT_NFT,
  IMPORT_SFT,
} from '../../constants'
import FlexBox from '../components/styles/FlexBox'
import FlexSpace from '../components/styles/FlexSpace'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import CreateSingle from '../components/createAndImportComponents/CreateSingle'
import CreateMultiple from '../components/createAndImportComponents/CreateMultiple'
import CreateSFT from '../components/createAndImportComponents/CreateSFT'
import ImportNFT from '../components/createAndImportComponents/ImportNFT'
import ImportSFT from '../components/createAndImportComponents/ImportSFT'

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
  const [createType, setCreateType] = useState<string>(CREATE_SINGLE)
  const [clearCounter, setClearCounter] = useState<number>(0)

  const router = useRouter()

  // Use before minting

  // const getFileUrl = async (file) => {
  //   try {
  //     const added = await client.add(file, {
  //       progress: (prog) => console.log(`received: ${prog}`),
  //     })
  //     const url = `https://ipfs.infura.io/ipfs/${added.path}`
  //     return url
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

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

  const StyledPageBase = styled('div')(({ theme }) => ({
    marginTop: MARGIN_LARGE,
    marginBottom: MARGIN_LARGE,
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
          <ToggleButton onClick={(e) => setCreateType(CREATE_SINGLE)}>
            Create Single
          </ToggleButton>
          <ToggleButton onClick={(e) => setCreateType(CREATE_MULTIPLE)}>
            Create Multiple
          </ToggleButton>
          <ToggleButton onClick={(e) => setCreateType(CREATE_SFT)}>
            Create SFT
          </ToggleButton>
          <ToggleButton onClick={(e) => setCreateType(IMPORT_NFT)}>
            Import NFT
          </ToggleButton>
          <ToggleButton onClick={(e) => setCreateType(IMPORT_SFT)}>
            Import SFT
          </ToggleButton>
        </ToggleButtonGroup>
        <FlexSpace />
        <Button onClick={(e) => setClearCounter(clearCounter + 1)}>
          Clear All
        </Button>
      </FlexBox>
      {createType === CREATE_SINGLE ? (
        <CreateSingle
          clearCounter={clearCounter}
          setClearCounter={setClearCounter}
        />
      ) : createType === CREATE_MULTIPLE ? (
        <CreateMultiple
          clearCounter={clearCounter}
          setClearCounter={setClearCounter}
        />
      ) : createType === CREATE_SFT ? (
        <CreateSFT
          clearCounter={clearCounter}
          setClearCounter={setClearCounter}
        />
      ) : createType === IMPORT_NFT ? (
        <ImportNFT
          clearCounter={clearCounter}
          setClearCounter={setClearCounter}
        />
      ) : createType === IMPORT_SFT ? (
        <ImportSFT
          clearCounter={clearCounter}
          setClearCounter={setClearCounter}
        />
      ) : null}
    </StyledPageBase>
  )
}
