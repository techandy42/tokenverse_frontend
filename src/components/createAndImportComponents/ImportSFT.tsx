import React from 'react'

interface IProps {
  clearCounter: number
  setClearCounter: React.Dispatch<SetStateAction<number>>
}

const ImportSFT: React.FC<IProps> = ({ clearCounter, setClearCounter }) => {
  return (
    <div>
      <h1>Import SFT</h1>
    </div>
  )
}

export default ImportSFT
