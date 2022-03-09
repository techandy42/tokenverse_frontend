import React from 'react'
import IItem from '../../../interfaces/IItem'
import NFTCard from '../card/NFTCard'
import DisplayItems from '../styles/DisplayItems'
import CardType from '../../../enums/CardType'

interface IProps {
  NFTs: IItem[]
}

const AccountDisplayNFTs: React.FC<IProps> = ({ NFTs }) => {
  return (
    <DisplayItems>
      {NFTs.map((NFT) => (
        <NFTCard NFT={NFT} size={CardType.LARGE} />
      ))}
    </DisplayItems>
  )
}

export default AccountDisplayNFTs
