import React from 'react'
import ICollectionNFTs from '../../../interfaces/ICollectionNFTs'
import AccountDisplayCollection from './AccountDisplayCollection'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { BREAKPOINT_SMALL, BREAKPOINT_LARGE } from '../../../constants'

interface IProps {
  collectionNFTs: ICollectionNFTs
}

const DisplayCollections = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'auto auto auto',
  gridGap: '4px',
  marginTop: '4px',
  [theme.breakpoints.up(BREAKPOINT_SMALL)]: {
    gridGap: '28px',
    marginTop: '28px',
  },
}))

const AccountDisplayCollections: React.FC<IProps> = ({ collectionNFTs }) => {
  const getCollectionNames = () => {
    const collectionNames = []
    for (const collectionName in collectionNFTs) {
      collectionNames.push(collectionName)
    }
    return collectionNames
  }

  const collectionNames = getCollectionNames()

  return (
    <DisplayCollections>
      {collectionNames.map((collectionName) => (
        <AccountDisplayCollection
          collectionName={collectionName}
          NFTs={collectionNFTs[collectionName]}
        />
      ))}
    </DisplayCollections>
  )
}

export default AccountDisplayCollections
