import React from 'react'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { FORM_MARGIN_BOTTOM_VALUE_LARGE } from '../../../constants/values'
import Alert from '@mui/material/Alert'
import urlValidityChecker from '../../../constants/urlValidityChecker'

const DomainName = ({ form, handleChange }) => {
  return (
    <>
      <Typography
        variant='h5'
        sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
      >
        Domain Name
      </Typography>
      <TextField
        sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
        fullWidth
        required
        name='domainName'
        label='Domain Name'
        value={form.domainName}
        onChange={handleChange}
      />
      {form.domainName !== '' && !urlValidityChecker(form.domainName) && (
        <Alert severity='error'>Invalid URL</Alert>
      )}
    </>
  )
}

export default DomainName
