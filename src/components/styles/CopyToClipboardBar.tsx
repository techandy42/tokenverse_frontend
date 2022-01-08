import React from 'react'
import FlexBox from './FlexBox'
import Button from '@mui/material/Button'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import Tooltip from '@mui/material/Tooltip'
import Input from '@mui/material/Input'

interface IProps {
  label: string
  value: string
}

const CopyToClipboardBar: React.FC<IProps> = ({ label, value }) => {
  return (
    <Tooltip placement='left' title={label}>
      <FlexBox
        sx={{
          marginBottom: '0.5rem',
        }}
      >
        <Input
          type='text'
          value={value}
          style={{
            color: '#323232',
            height: '2rem',
            width: '12.5rem',
            outline: 'none',
            paddingLeft: '0.1rem',
          }}
        />
        <Button
          sx={{
            backgroundColor: 'white',
            color: '#484848',
            border: '1px solid grey',
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '0 2px 2px 0',
          }}
          onClick={() => {
            navigator.clipboard.writeText(value)
          }}
        >
          <AssignmentTurnedInIcon sx={{ fontSize: 17.5 }} />
        </Button>
      </FlexBox>
    </Tooltip>
  )
}

export default CopyToClipboardBar
