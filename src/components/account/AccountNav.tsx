import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Link from 'next/link'

interface IProps {
  index: number
}

const AccountNav: React.FC<IProps> = ({ index }) => {
  const [tabIndex, setTabIndex] = React.useState<number>(index)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
    console.log(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleChange}>
          <Link href='/account'>
            <Tab label='All' />
          </Link>
          <Link href='/account/created'>
            <Tab label='Created' />
          </Link>
          <Link href='/account/purchased'>
            <Tab label='Purchased' />
          </Link>
          <Link href='/account/shopping-cart'>
            <Tab label='Cart' />
          </Link>
          <Link href='/account/favorite'>
            <Tab label='Favorite' />
          </Link>
        </Tabs>
      </Box>
    </Box>
  )
}

export default AccountNav
