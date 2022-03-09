import React from 'react'
import StyledWidePageBase from '../styles/StyledWidePageBase'
import ICollectionRelation from '../../../interfaces/schemaRelations/ICollectionRelation'
import CollectionDisplayNFTs from './CollectionDisplayNFTs'
import IItem from '../../../interfaces/IItem'

interface IProps {
  isCreator: boolean
  collectionData: ICollectionRelation
  nfts: IItem[]
}

const CollectionPage: React.FC<IProps> = ({
  isCreator,
  collectionData,
  nfts,
}) => {
  console.log('collectionData: ', collectionData)
  console.log('nfts: ', nfts)

  return (
    <StyledWidePageBase>
      <p>{isCreator ? 'true' : 'false'}</p>
      <CollectionDisplayNFTs NFTs={nfts} />
    </StyledWidePageBase>
  )
}

export default CollectionPage
