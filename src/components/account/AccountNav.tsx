import React, { useState, useEffect } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Link from 'next/link'
import { AccountNavType } from '../../../enums/PageType'

interface IProps {
  index: number
  accountNavType: AccountNavType
  id?: string | string[] | undefined
}

const defaultLinks = [
  '/account',
  '/account/created',
  '/account/purchased',
  '/account/shopping-cart',
  '/account/favorite',
]

const AccountNav: React.FC<IProps> = ({ index, accountNavType, id }) => {
  const [tabIndex, setTabIndex] = useState<number>(index)
  const [links, setLinks] = useState<string[]>(defaultLinks)

  useEffect(() => {
    const changeLinks = (linkId: string) => {
      const newLinks = [
        `/user/${linkId}`,
        `/user/${linkId}/created`,
        `/user/${linkId}/purchased`,
        `/user/${linkId}/shopping-cart`,
        `/user/${linkId}/favorite`,
      ]
      setLinks(newLinks)
    }

    if (typeof id === 'string') {
      // valid id (string)
      changeLinks(id)
    } else if (id !== undefined) {
      // valid id (string[])
      changeLinks(id[0])
    }
  }, [id])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
    console.log(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleChange}>
          <Link href={links[0]}>
            <Tab label='All' />
          </Link>
          <Link href={links[1]}>
            <Tab label='Created' />
          </Link>
          <Link href={links[2]}>
            <Tab label='Purchased' />
          </Link>
          <Link href={links[3]}>
            <Tab label='Cart' />
          </Link>
          <Link href={links[4]}>
            <Tab label='Favorite' />
          </Link>
        </Tabs>
      </Box>
    </Box>
  )
}

export default AccountNav
