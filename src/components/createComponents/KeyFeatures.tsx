import React from 'react'
import {
  FORM_MARGIN_BOTTOM_VALUE_SMALL,
  FORM_MARGIN_BOTTOM_VALUE_LARGE,
} from '../../../constants/values'
import FlexBox from '../styles/FlexBox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const KeyFeatures = ({ form, handleChange }) => {
  return (
    <>
      <Typography
        variant='h5'
        sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
      >
        Key Features
      </Typography>
      <FlexBox sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}>
        <TextField
          fullWidth
          required
          name='topColorOne'
          label='Top Color #1'
          value={form.topColorOne}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          required
          name='topFeatureOne'
          label='Top Feature #1'
          value={form.topFeatureOne}
          onChange={handleChange}
        />
      </FlexBox>
      <FlexBox sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}>
        <TextField
          sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}
          fullWidth
          required
          name='topColorTwo'
          label='Top Color #2'
          value={form.topColorTwo}
          onChange={handleChange}
        />
        <TextField
          sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}
          fullWidth
          required
          name='topFeatureTwo'
          label='Top Feature #2'
          value={form.topFeatureTwo}
          onChange={handleChange}
        />
      </FlexBox>
    </>
  )
}

export default KeyFeatures
