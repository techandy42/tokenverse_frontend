import React from 'react'
import Typography from '@mui/material/Typography'
import Input from '@mui/material/Input'
import { FORM_MARGIN_BOTTOM_VALUE_SMALL } from '../../../constants/values'
import FlexBox from '../styles/FlexBox'

const Level = ({ form, handleChange }) => {
  return (
    <div>
      <Typography sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}>
        Level
      </Typography>
      <FlexBox>
        <Input
          type='number'
          fullWidth
          name='levelPoint'
          value={form.levelPoint}
          onChange={handleChange}
        />
        <Typography
          variant='overline'
          sx={{
            marginLeft: FORM_MARGIN_BOTTOM_VALUE_SMALL,
            marginRight: FORM_MARGIN_BOTTOM_VALUE_SMALL,
          }}
        >
          of
        </Typography>
        <Input
          type='number'
          fullWidth
          name='levelStep'
          value={form.levelStep}
          onChange={handleChange}
        />
      </FlexBox>
    </div>
  )
}

export default Level
