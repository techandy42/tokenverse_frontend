import React from 'react'
import Typography from '@mui/material/Typography'
import TokenIcon from '@mui/icons-material/Token'
import FlexBox from '../components/styles/FlexBox'
import Button from '@mui/material/Button'
import Link from 'next/link'
import Box from '@mui/material/Box'
import styles from './index/index.module.css'

// Note (order):
// front -> left -> back -> right

const home = () => {
  return (
    <div>
      {/* Full Screen */}
      <Box /*sx={{ display: { xs: 'none', lg: 'block' } }}*/>
        <Box
          className={styles.backgroundgradient}
          style={{ width: '100%', height: '40rem' }}
        >
          <Box
            sx={{
              position: 'absolute',
              marginTop: '17.5rem',
              marginLeft: { xs: 0, sm: '2rem', md: '5rem' },
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
          </Box>
          <Box sx={{ display: { xs: 'none', lg: 'inline' } }}>
            <div className={styles.cube}>
              <div className={styles.top}></div>
              <div className={styles.right}>Tokenverse</div>
              <div className={styles.bottom}></div>
              <div className={styles.left}>Create</div>
              <div className={styles.front}>Design</div>
              <div className={styles.back}>Trade</div>
            </div>
          </Box>
          <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
            <div className={styles.cube} />
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default home
