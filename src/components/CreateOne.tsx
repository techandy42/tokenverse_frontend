import React, { useState, useEffect } from 'react'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Input from '@mui/material/Input'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Switch from '@mui/material/Switch'
import IconButton from '@mui/material/IconButton'
import ClearIcon from '@mui/icons-material/Clear'
import AddIcon from '@mui/icons-material/Add'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import IOSSwitch from './styles/IOSSwitch'
import { collections } from '../pages/create'
import tokenTypes from '../../constants/tokenTypes'
import blockchainTypes from '../../constants/blockchainTypes'
import {
  FORM_MARGIN_BOTTOM_VALUE_LARGE,
  FORM_MARGIN_BOTTOM_VALUE_SMALL,
  FORM,
} from '../../constants/values'
import AccessLocationList from './createComponents/AccessLocationList'
import AbilityList from './createComponents/AbilityList'
import PropertyList from './createComponents/PropertyList'
import Point from './createComponents/Point'
import Level from './createComponents/Level'
import SensitiveContent from './createComponents/SensitiveContent'
import KeyFeatures from './createComponents/KeyFeatures'
import DomainName from './createComponents/DomainName'
import TokenNameDescription from './createComponents/TokenNameDescription'
import FlexBox from './styles/FlexBox'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const CreateOne = ({
  tokenType,
  forms,
  setForms,
  fileUrls,
  setFileUrls,
  clearCounter,
}) => {
  const [form, setForm] = useState(FORM)

  useEffect(() => {
    setForm(FORM)
  }, [clearCounter])

  const onChangeFile = async (e) => {
    // Add a fileUrl to fileUrls
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <>
      {!fileUrls[0] ? (
        <Button
          variant='contained'
          component='label'
          sx={{
            width: '24rem',
            heigth: '20rem',
            marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE,
          }}
        >
          Upload File
          <input type='file' name='Asset' onChange={onChangeFile} hidden />
        </Button>
      ) : null}
      {fileUrls[0] ? (
        <Button
          variant='contained'
          component='label'
          sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
          onClick={(e) => setFileUrls([])}
        >
          Remove File
        </Button>
      ) : null}
      {/* <Button
        sx={{
          width: '24rem',
          height: '20rem',
          borderRadius: '0.5rem',
          border: '0.2rem dotted black',
          justifyContent: 'center',
        }}
      >
        <IconButton
          size='large'
          edge='end'
          color='inherit'
          disableRipple
          sx={{ width: '10rem', height: '10rem' }}
          // onClick={(e) => handleRemoveAbility(i)}
        >
          <AddAPhotoIcon color='primary' />
        </IconButton>
        <input type='file' name='Asset' onChange={onChangeFile} hidden />
      </Button> */}
      <Box
        sx={{
          marginBottom: fileUrls[0] ? FORM_MARGIN_BOTTOM_VALUE_LARGE : 0,
        }}
      >
        <img width='350' src={fileUrls[0]} />
      </Box>
      <TokenNameDescription form={form} handleChange={handleChange} />
      <Divider sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }} />
      {tokenType === 'Domain Names' ? (
        <DomainName form={form} handleChange={handleChange} />
      ) : (
        <KeyFeatures form={form} handleChange={handleChange} />
      )}
      <Divider sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }} />
      <PropertyList form={form} setForm={setForm} />
      <Divider sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }} />
      <AccessLocationList form={form} setForm={setForm} />
      {tokenType === 'Trading Cards' ||
      tokenType === 'Virtual Reality - Real Estates' ||
      tokenType === 'Virtual Reality - Accessories' ? (
        <>
          <Divider sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }} />
          <Point form={form} handleChange={handleChange} />
          <Level form={form} handleChange={handleChange} />
          <AbilityList form={form} setForm={setForm} />
        </>
      ) : null}
      <Divider />
      <SensitiveContent form={form} setForm={setForm} />
      <Divider sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }} />
    </>
  )
}

export default CreateOne
