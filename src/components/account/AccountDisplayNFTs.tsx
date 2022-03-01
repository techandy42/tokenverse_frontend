import React from 'react'
import IItem from '../../../interfaces/IItem'
import NFTCard from '../card/NFTCard'
import DisplayItems from '../styles/DisplayItems'

interface IProps {
  NFTs: IItem[]
}

const AccountDisplayNFTs: React.FC<IProps> = ({ NFTs }) => {
  return (
    <DisplayItems>
      {NFTs.map((NFT) => (
        <NFTCard NFT={NFT} />
      ))}
    </DisplayItems>
  )
}

export default AccountDisplayNFTs
