import React from 'react'
import IItem from '../../../interfaces/IItem'
import AccountDisplayNFT from './AccountDisplayNFT'
import DisplayItems from '../styles/DisplayItems'

interface IProps {
  NFTs: IItem[]
}

const AccountDisplayNFTs: React.FC<IProps> = ({ NFTs }) => {
  return (
    <DisplayItems>
      {NFTs.map((NFT) => (
        <AccountDisplayNFT NFT={NFT} />
      ))}
    </DisplayItems>
  )
}

export default AccountDisplayNFTs
