import React from 'react'
import StyledPageBase from '../components/styles/StyledPageBase'
import Button from '@mui/material/Button'
import Link from 'next/link'

const Help = () => {
  return (
    <StyledPageBase>
      <Link href='https://github.com/gitHubAndyLee2020/tokenverse_frontend'>
        <Button className='btn' variant='outlined'>
          More Information Here
        </Button>
      </Link>
    </StyledPageBase>
  )
}

export default Help
