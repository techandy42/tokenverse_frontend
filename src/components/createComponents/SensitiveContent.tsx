import React from 'react'
import FlexBox from '../styles/FlexBox'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import { FORM_MARGIN_BOTTOM_VALUE_SMALL } from '../../../constants/values'

const SensitiveContent = ({ form, setForm }) => {
  const handleIsSensitiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, isSensitive: !form.isSensitive })
  }

  return (
    <FlexBox
      sx={{
        marginTop: FORM_MARGIN_BOTTOM_VALUE_SMALL,
        marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL,
      }}
    >
      <Switch checked={form.isSensitive} onChange={handleIsSensitiveChange} />
      <Typography sx={{ marginLeft: FORM_MARGIN_BOTTOM_VALUE_SMALL }}>
        Sensitive Content
      </Typography>
    </FlexBox>
  )
}

export default SensitiveContent
