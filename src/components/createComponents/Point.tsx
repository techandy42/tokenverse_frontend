import React from 'react'
import Typography from '@mui/material/Typography'
import Input from '@mui/material/Input'
import { FORM_MARGIN_BOTTOM_VALUE_SMALL } from '../../../constants/values'
import Box from '@mui/material/Box'

const Point = ({ form, handleChange }) => {
  return (
    <Box sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}>
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
    </Box>
  )
}

export default Point
