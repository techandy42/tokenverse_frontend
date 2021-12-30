import React from 'react'
import TextField from '@mui/material/TextField'
import {
  FORM_MARGIN_BOTTOM_VALUE_SMALL,
  FORM_MARGIN_BOTTOM_VALUE_LARGE,
} from '../../../constants/values'

const TokenNameDescription = ({ form, handleChange }) => {
  return (
    <>
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
    </>
  )
}

export default TokenNameDescription
