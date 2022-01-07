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
          color: '#242424',
          backgroundColor: 'lightGrey',
          border: 0,
          height: '1.5rem',
          borderRadius: '2px 0 0 2px',
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
          backgroundColor: 'lightGrey',
          color: '#646464',
          border: 0,
          height: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0 2px 2px 0',
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
