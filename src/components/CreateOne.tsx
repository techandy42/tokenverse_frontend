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

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const CreateOne = ({
  collection,
  setCollection,
  tokenType,
  setTokenType,
  blockchainType,
  setBlockchainType,
  forms,
  setForms,
  fileUrls,
  setFileUrls,
  clearCounter,
}) => {
  const [form, setForm] = useState(FORM)

  const handleIsSensitiveChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm({ ...form, isSensitive: !form.isSensitive })
  }

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
    if (e.target.name === 'point') {
      if (e.target.value < 0 || e.target.value > 1000) return
    }
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAddProperty = (e) => {
    setForm({ ...form, properties: [...form.properties, ['', '']] })
  }

  const handleRemoveProperty = (i) => {
    setForm({
      ...form,
      properties: [
        ...form.properties.slice(0, i),
        ...form.properties.slice(i + 1),
      ],
    })
  }

  const handlePropertyChange = (e, i) => {
    let newProperty = form.properties[i]
    if (e.target.name === 'propertyName') {
      newProperty = [e.target.value, form.properties[i][1]]
    } else if (e.target.name === 'propertyValue') {
      newProperty = [form.properties[i][0], e.target.value]
    } else {
      newProperty = [e.target.value, form.properties[i][1]]
    }
    const newProperties = [
      ...form.properties.slice(0, i),
      newProperty,
      ...form.properties.slice(i + 1),
    ]
    setForm({ ...form, properties: newProperties })
  }

  const handleAddAccessLocation = (e) => {
    setForm({
      ...form,
      accessLocations: [...form.accessLocations, ['', '', '']],
    })
  }

  const handleRemoveAccessLocation = (i) => {
    setForm({
      ...form,
      accessLocations: [
        ...form.accessLocations.slice(0, i),
        ...form.accessLocations.slice(i + 1),
      ],
    })
  }

  const handleAccessLocationChange = (e, i) => {
    let newAccessLocation = form.accessLocations[i]
    if (e.target.name === 'accessLocationName') {
      newAccessLocation = [
        e.target.value,
        form.accessLocations[i][1],
        form.accessLocations[i][2],
      ]
    } else if (e.target.name === 'accessLocationDescription') {
      newAccessLocation = [
        form.accessLocations[i][0],
        e.target.value,
        form.accessLocations[i][2],
      ]
    } else if (e.target.name === 'accessLocationUrl') {
      newAccessLocation = [
        form.accessLocations[i][0],
        form.accessLocations[i][1],
        e.target.value,
      ]
    } else {
      newAccessLocation = [
        e.target.value,
        form.accessLocations[i][1],
        form.accessLocations[i][2],
      ]
    }
    const newAccessLocations = [
      ...form.accessLocations.slice(0, i),
      newAccessLocation,
      ...form.accessLocations.slice(i + 1),
    ]
    setForm({ ...form, accessLocations: newAccessLocations })
  }

  const handleRenameInitialCollection = (e) => {
    // Rename the initial collection
  }

  return (
    <form>
      <Typography
        variant='h3'
        sx={{
          marginTop: FORM_MARGIN_BOTTOM_VALUE_LARGE,
          marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE,
        }}
      >
        Create Single
      </Typography>
      <Typography sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}>
        Collection
      </Typography>
      <Select
        labelId='collection'
        value={collection}
        onChange={(e) => setCollection(e.target.value)}
        fullWidth
        sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}
      >
        {collections.map((collection, i) => (
          <MenuItem value={collection}>{collection}</MenuItem>
        ))}
      </Select>
      {collection === collections[0] ? (
        <>
          <Typography sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}>
            Optional
          </Typography>
          <Box
            sx={{
              display: 'flex',
              marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE,
            }}
          >
            <TextField
              // sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
              fullWidth
              multiline
              name='renameInitialCollection'
              label='Rename Initial Collection'
              value={form.description}
              onChange={handleChange}
            />
            <IconButton
              size='large'
              edge='end'
              color='inherit'
              disableRipple
              onClick={handleRenameInitialCollection}
            >
              <AddCircleOutlineIcon color='primary' />
            </IconButton>
          </Box>
        </>
      ) : null}
      <Typography sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}>
        Type
      </Typography>
      <Select
        labelId='tokenType'
        value={tokenType}
        onChange={(e) => setTokenType(e.target.value)}
        fullWidth
        sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
      >
        {tokenTypes.map((tokenType) => (
          <MenuItem value={tokenType}>{tokenType}</MenuItem>
        ))}
      </Select>
      <Typography sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}>
        Blockchain
      </Typography>
      <Select
        labelId='blockchain'
        value={blockchainType}
        onChange={(e) => setBlockchainType(e.target.value)}
        fullWidth
        sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
      >
        {blockchainTypes.map((blockchainType) => (
          <MenuItem value={blockchainType}>{blockchainType}</MenuItem>
        ))}
      </Select>
      {!fileUrls[0] ? (
        <Button
          variant='contained'
          component='label'
          sx={{
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
      <Box
        sx={{
          marginBottom: fileUrls[0] ? FORM_MARGIN_BOTTOM_VALUE_LARGE : 0,
        }}
      >
        <img width='350' src={fileUrls[0]} />
      </Box>
      <TextField
        sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}
        fullWidth
        name='name'
        label='Name'
        value={form.name}
        onChange={handleChange}
        required
      />
      <TextField
        sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
        fullWidth
        multiline
        name='description'
        label='Description'
        value={form.description}
        onChange={handleChange}
        required
      />
      <Divider sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }} />
      <Typography
        variant='h5'
        sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}
      >
        Optional
      </Typography>
      {tokenType === 'Domain Names' ? (
        <TextField
          sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
          fullWidth
          variant='filled'
          name='domainName'
          label='Domain Name'
          value={form.domainName}
          onChange={handleChange}
        />
      ) : (
        <>
          <TextField
            sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}
            fullWidth
            variant='filled'
            name='topColorOne'
            label='Top Color #1'
            value={form.topColorOne}
            onChange={handleChange}
          />
          <TextField
            sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}
            fullWidth
            variant='filled'
            name='topColorTwo'
            label='Top Color #2'
            value={form.topColorTwo}
            onChange={handleChange}
          />
          <TextField
            sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}
            fullWidth
            variant='filled'
            name='topFeatureOne'
            label='Top Feature #1'
            value={form.topFeatureOne}
            onChange={handleChange}
          />
          <TextField
            sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
            fullWidth
            variant='filled'
            name='topFeatureTwo'
            label='Top Feature #2'
            value={form.topFeatureTwo}
            onChange={handleChange}
          />
        </>
      )}
      <Divider sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }} />
      <Box
        sx={{
          marginTop: FORM_MARGIN_BOTTOM_VALUE_LARGE,
          marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE,
        }}
      >
        <Button
          variant='contained'
          sx={{
            marginBottom:
              form.accessLocations.length > 0
                ? FORM_MARGIN_BOTTOM_VALUE_SMALL
                : 0,
          }}
          onClick={handleAddAccessLocation}
        >
          Add Access Location
        </Button>
        {form.accessLocations.map((accessLocation, i) => (
          <Box
            sx={{
              display: 'flex',
              marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL,
            }}
          >
            <TextField
              fullWidth
              name='accessLocationName'
              label='Access Location Name'
              value={accessLocation[0]}
              onChange={(e) => handleAccessLocationChange(e, i)}
            />
            <TextField
              fullWidth
              name='accessLocationDescription'
              label='Access Location Description'
              value={accessLocation[1]}
              onChange={(e) => handleAccessLocationChange(e, i)}
            />
            <TextField
              fullWidth
              name='accessLocationUrl'
              label='Access Location Url'
              value={accessLocation[2]}
              onChange={(e) => handleAccessLocationChange(e, i)}
            />
            <IconButton
              size='large'
              edge='end'
              color='inherit'
              disableRipple
              onClick={(e) => handleRemoveAccessLocation(i)}
            >
              <RemoveCircleOutlineIcon color='primary' />
            </IconButton>
          </Box>
        ))}
      </Box>
      {tokenType === 'Trading Cards' ||
      tokenType === 'Virtual Reality - Properties' ||
      tokenType === 'Virtual Reality - Accessories' ? (
        <>
          <Divider sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }} />
          <Typography sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}>
            Point
          </Typography>
          <Input
            type='number'
            sx={{ marginBottom: '0.1rem' }}
            fullWidth
            name='point'
            value={form.point}
            onChange={handleChange}
          />
          <Typography variant='overline'>0 - 1000</Typography>
          <Box
            sx={{
              marginTop: FORM_MARGIN_BOTTOM_VALUE_LARGE,
              marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE,
            }}
          >
            <Button
              variant='contained'
              sx={{
                marginBottom:
                  form.properties.length > 0
                    ? FORM_MARGIN_BOTTOM_VALUE_SMALL
                    : 0,
              }}
              onClick={handleAddProperty}
            >
              Add Property
            </Button>
            {form.properties.map((property, i) => (
              <Box
                sx={{
                  display: 'flex',
                  marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL,
                }}
              >
                <TextField
                  fullWidth
                  name='propertyName'
                  label='Property Name'
                  value={property[0]}
                  onChange={(e) => handlePropertyChange(e, i)}
                />
                <TextField
                  fullWidth
                  name='propertyValue'
                  label='Property Value'
                  value={property[i][1]}
                  onChange={(e) => handlePropertyChange(e, i)}
                />
                <IconButton
                  size='large'
                  edge='end'
                  color='inherit'
                  disableRipple
                  onClick={(e) => handleRemoveProperty(i)}
                >
                  <RemoveCircleOutlineIcon color='primary' />
                </IconButton>
              </Box>
            ))}
          </Box>
        </>
      ) : null}
      <Divider />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginTop: FORM_MARGIN_BOTTOM_VALUE_SMALL,
          marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL,
        }}
      >
        <Switch checked={form.isSensitive} onChange={handleIsSensitiveChange} />
        <Typography
          variant='outlined'
          sx={{ marginLeft: FORM_MARGIN_BOTTOM_VALUE_SMALL }}
        >
          Sensitive Content
        </Typography>
      </Box>
      <Divider sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }} />
      <Button variant='outlined' /*onClick={createItem}*/>
        Create Digital Asset
      </Button>
    </form>
  )
}

export default CreateOne
