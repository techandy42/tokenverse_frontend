import React from 'react'
import ICollectionNFTs from '../../../interfaces/ICollectionNFTs'
import CollectionCard from '../card/CollectionCard'
import DisplayItems from '../styles/DisplayItems'

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
    <DisplayItems>
      {collectionNames.map((collectionName) => (
        <CollectionCard
          collectionName={collectionName}
          NFTs={collectionNFTs[collectionName]}
        />
      ))}
    </DisplayItems>
  )
}

export default AccountDisplayCollections
