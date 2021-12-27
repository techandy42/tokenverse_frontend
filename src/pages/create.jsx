import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import { nftaddress, nftmarketaddress } from '../../config'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Input from '@mui/material/Input'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Box from '@mui/material/Box'

import IOSSwitch from '../components/styles/iosSwitch'

export default function Create() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formTextField, updateFormTextField] = useState({
    price: '',
    name: '',
    description: '',
  })
  const router = useRouter()

  async function onChangeFile(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      })
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (e) {
      console.log(e)
    }
  }

  async function createItem() {
    const { name, description, price } = formTextField
    if (!name || !description || !price || !fileUrl) return
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    })

    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      createSale(url)
    } catch (error) {
      console.log(`Error uploading file: `, error)
    }
  }

  async function createSale(url) {
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

    const price = ethers.utils.parseUnits(formTextField.price, 'ether')

    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    })
    await transaction.wait()
    router.push('/')
  }

  return (
    <form>
      <FormControl fullWidth>
        <InputLabel id='collection'>Collection</InputLabel>
        <Select
          labelId='collection'
          // value={age}
          // onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label='Name'
        onChange={(e) =>
          updateFormTextField({ ...formTextField, name: e.target.value })
        }
        defaultValue=''
      />
      <TextField
        label='Description'
        onChange={(e) =>
          updateFormTextField({
            ...formTextField,
            description: e.target.value,
          })
        }
        defaultValue=''
      />
      <TextField
        label='URL Reference'
        onChange={(e) =>
          updateFormTextField({
            ...formTextField,
            description: e.target.value,
          })
        }
        defaultValue=''
      />
      <FormControl fullWidth>
        <InputLabel id='price'>Price</InputLabel>
        <Input labelId='price' type='number' defaultValue={1} />
      </FormControl>
      <FormControlLabel
        control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
        label='iOS style'
      />
      <Input
        type='file'
        name='Asset'
        className='my-4'
        onChange={onChangeFile}
      />
      {fileUrl && <img width='350' src={fileUrl} />}
      <FormControl fullWidth>
        <InputLabel id='quantity'>Quantity</InputLabel>
        <Input labelId='quantity' type='number' defaultValue={1} disabled />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id='blockchain'>Blockchain</InputLabel>
        <Select
          labelId='blockchain'
          // value={age}
          // onChange={handleChange}
          defaultValue='Polygon'
        >
          <MenuItem value={10}>Polygon</MenuItem>
        </Select>
      </FormControl>
      <Button onClick={createItem}>Create Digital Asset</Button>
    </form>
  )
}
