import React from 'react'

interface IProps {
  clearCounter: number
  setClearCounter: React.Dispatch<SetStateAction<number>>
}

const CreateSFT: React.FC<IProps> = ({ clearCounter, setClearCounter }) => {
  return (
    <div>
      <h1>Create SFT</h1>
    </div>
  )
}

export default CreateSFT
