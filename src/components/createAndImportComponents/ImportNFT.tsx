import React from 'react'

interface IProps {
  clearCounter: number
  setClearCounter: React.Dispatch<SetStateAction<number>>
}

const ImportNFT: React.FC<IProps> = ({ clearCounter, setClearCounter }) => {
  return (
    <div>
      <h1>Import NFT</h1>
    </div>
  )
}

export default ImportNFT
