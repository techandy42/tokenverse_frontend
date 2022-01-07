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
        style={{
          color: 'grey',
          backgroundColor: 'lightGrey',
          border: 0,
          height: '1.5rem',
          borderRadius: '4px 0 0 4px',
          borderTop: '1px solid grey',
          borderLeft: '1px solid grey',
          borderBottom: '1px solid grey',
        }}
      >
        {label}
      </button>
      <input
        type='text'
        value={value}
        style={{
          color: 'grey',
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
          backgroundColor: 'lightGrey',
          color: 'grey',
          border: 0,
          height: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0 4px 4px 0',
          borderTop: '1px solid grey',
          borderRight: '1px solid grey',
          borderBottom: '1px solid grey',
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
