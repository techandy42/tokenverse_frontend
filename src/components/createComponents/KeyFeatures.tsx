import React from 'react'
import { FORM_MARGIN_BOTTOM_VALUE_SMALL } from '../../../constants/values'
import FlexBox from '../styles/FlexBox'
import TextField from '@mui/material/TextField'

const KeyFeatures = ({ form, handleChange }) => {
  return (
    <>
      <FlexBox sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}>
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
