import React from 'react'
import IItem from '../../../interfaces/IItem'
import NFTCard from '../card/NFTCard'
import DisplayWidePageItems from '../styles/DisplayWidePageItems'
import CardType from '../../../enums/CardType'

interface IProps {
  NFTs: IItem[]
}

const CollectionDisplayNFTs: React.FC<IProps> = ({ NFTs }) => {
  return (
    <DisplayWidePageItems>
      {NFTs.map((NFT) => (
        <NFTCard NFT={NFT} size={CardType.SMALL} />
      ))}
    </DisplayWidePageItems>
  )
}

export default CollectionDisplayNFTs
