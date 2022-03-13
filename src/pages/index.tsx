import React from 'react'
import Typography from '@mui/material/Typography'
import TokenIcon from '@mui/icons-material/Token'
import FlexBox from '../components/styles/FlexBox'
import Button from '@mui/material/Button'
import Link from 'next/link'

// Note (order):
// front -> left -> back -> right

const home = () => {
  return (
    <div>
      <div className='top-background'>
        <div
          style={{
            position: 'absolute',
            marginTop: '17.5rem',
            marginLeft: '5rem',
          }}
        >
          <FlexBox>
            <TokenIcon sx={{ fontSize: '4rem' }} />
            <Typography className='font-chakra' sx={{ fontSize: '4rem' }}>
              Tokenverse
            </Typography>
          </FlexBox>
          <Typography
            variant='h6'
            className='font-chakra'
            sx={{ marginBottom: '2.5rem' }}
          >
            An all-in-one platform to design, create, buy, and sell NFTs
          </Typography>
          <FlexBox>
            {/* Change the link when building the category pages */}
            <Link href='/'>
              <Button
                variant='contained'
                className='btn'
                sx={{ width: '7.5rem', marginRight: '1rem' }}
              >
                Discover
              </Button>
            </Link>
            <Link href='/create'>
              <Button
                variant='outlined'
                className='btn'
                sx={{ width: '7.5rem' }}
              >
                Create
              </Button>
            </Link>
          </FlexBox>
        </div>
        <div className='cube'>
          <div className='top'></div>
          <div className='right'>Tokenverse</div>
          <div className='bottom'></div>
          <div className='left'>Create</div>
          <div className='front'>Design</div>
          <div className='back'>Trade</div>
        </div>
      </div>
    </div>
  )
}

export default home
