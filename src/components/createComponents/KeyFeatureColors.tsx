import React from 'react'
import {
  FORM_MARGIN_BOTTOM_VALUE_SMALL,
  FORM_MARGIN_BOTTOM_VALUE_LARGE,
  colors,
} from '../../../constants/values'
import FlexBox from '../styles/FlexBox'
import TextField from '@mui/material/TextField'
import { Autocomplete } from '@mui/material'

const KeyFeatureColors = ({ form, setForm, handleChange }) => {
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
        <Autocomplete
          fullWidth
          value={form.topColorOne}
          onChange={(e, newValue) => {
            newValue !== null
              ? setForm({ ...form, topColorOne: newValue })
              : setForm({ ...form, topColorOne: '' })
          }}
          onInputChange={(e, newInputValue) => {
            colors.includes(newInputValue)
              ? setForm({ ...form, topColorOne: newInputValue })
              : null
          }}
          options={colors}
          renderInput={(params) => (
            <TextField required {...params} label='Top Color #1' />
          )}
        />
      </FlexBox>
      <FlexBox sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}>
        <TextField
          fullWidth
          required
          name='topFeatureTwo'
          label='Top Feature #2'
          value={form.topFeatureTwo}
          onChange={handleChange}
        />
        <Autocomplete
          fullWidth
          value={form.topColorTwo}
          onChange={(e, newValue) => {
            newValue !== null
              ? setForm({ ...form, topColorTwo: newValue })
              : setForm({ ...form, topColorTwo: '' })
          }}
          onInputChange={(e, newInputValue) => {
            colors.includes(newInputValue)
              ? setForm({ ...form, topColorTwo: newInputValue })
              : null
          }}
          options={colors}
          renderInput={(params) => (
            <TextField required {...params} label='Top Color #2' />
          )}
        />
      </FlexBox>
    </>
  )
}

export default KeyFeatureColors
