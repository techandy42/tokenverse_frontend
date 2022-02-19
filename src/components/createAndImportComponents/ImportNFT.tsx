import React from 'react'
import Typography from '@mui/material/Typography'
import { MARGIN_LARGE } from '../../../constants'

interface IProps {
  clearCounter: number
  setClearCounter: React.Dispatch<SetStateAction<number>>
}

const ImportNFT: React.FC<IProps> = ({ clearCounter, setClearCounter }) => {
  return (
    <div>
      <Typography
        variant='h3'
        sx={{
          marginTop: MARGIN_LARGE,
          marginBottom: MARGIN_LARGE,
          fontWeight: 200,
        }}
        className='font-chakra'
      >
        Import a NFT - Coming Soon
      </Typography>
    </div>
  )
}

export default ImportNFT
