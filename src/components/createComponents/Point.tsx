import React from 'react'
import Typography from '@mui/material/Typography'
import Input from '@mui/material/Input'
import { FORM_MARGIN_BOTTOM_VALUE_SMALL } from '../../../constants/values'

const Point = ({ form, handleChange }) => {
  return (
    <div>
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
      {/* Adjust the range */}
      <Typography variant='overline'>Enter Range Here</Typography>
    </div>
  )
}

export default Point
