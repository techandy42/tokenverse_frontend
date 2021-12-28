import React from 'react'

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Input from '@mui/material/Input'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'

import IOSSwitch from './styles/IOSSwitch'

const CreateOne = () => {
  return (
    <form>
      {/* <FormControl fullWidth>
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
      <Button onClick={createItem}>Create Digital Asset</Button> */}
    </form>
  )
}

export default CreateOne
