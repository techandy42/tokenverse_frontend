import React from 'react'
import TextField from '@mui/material/TextField'
import { FORM_MARGIN_BOTTOM_VALUE_LARGE } from '../../../constants/values'

const DomainName = ({ form, handleChange }) => {
  return (
    <TextField
      sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
      fullWidth
      variant='filled'
      name='domainName'
      label='Domain Name'
      value={form.domainName}
      onChange={handleChange}
    />
  )
}

export default DomainName
