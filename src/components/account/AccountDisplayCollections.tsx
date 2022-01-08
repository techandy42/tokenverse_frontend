import React from 'react'
import ICollectionNFTs from '../../../interfaces/ICollectionNFTs'
import AccountDisplayCollection from './AccountDisplayCollection'
import Box from '@mui/material/Box'

interface IProps {
  collectionNFTs: ICollectionNFTs
}

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
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto auto auto',
        gridGap: '1rem',
      }}
    >
      {collectionNames.map((collectionName) => (
        <AccountDisplayCollection
          collectionName={collectionName}
          NFTs={collectionNFTs[collectionName]}
        />
      ))}
    </Box>
  )
}

export default AccountDisplayCollections
