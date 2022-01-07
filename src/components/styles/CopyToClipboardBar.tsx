import React from 'react'
import FlexBox from './FlexBox'
import Button from '@mui/material/Button'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'

interface IProps {
  label: string
  value: string
}

const CopyToClipboardBar: React.FC<IProps> = ({ label, value }) => {
  return (
    <FlexBox
      sx={{
        marginBottom: '0.5rem',
      }}
    >
      <button
        className='font-chakra'
        style={{
          color: '#080808',
          backgroundColor: '#A0A0A0',
          border: '1px solid grey',
          height: '1.5rem',
          borderRadius: '2px 0 0 2px',
          width: '4rem',
        }}
      >
        {label}
      </button>
      <input
        type='text'
        value={value}
        style={{
          color: '#323232',
          border: 0,
          height: '1.5rem',
          width: '12.5rem',
          outline: 'none',
          borderTop: '1px solid grey',
          borderBottom: '1px solid grey',
        }}
      />
      <Button
        sx={{
          backgroundColor: '#A0A0A0',
          color: '#484848',
          border: '1px solid grey',
          height: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0 2px 2px 0',
        }}
        onClick={() => {
          navigator.clipboard.writeText(value)
        }}
      >
        <AssignmentTurnedInIcon sx={{ fontSize: 15 }} />
      </Button>
    </FlexBox>
  )
}

export default CopyToClipboardBar
