import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import IItem from '../../../interfaces/IItem'
import Link from 'next/link'
import FlexBox from '../styles/FlexBox'
import FlexSpace from '../styles/FlexSpace'

interface IProps {
  NFT: IItem
}

const AccountDisplayCollection: React.FC<IProps> = ({ NFT }) => {
  console.log('NFT: ', NFT)

  const formatNFTName = (NFTName: string) => {
    if (NFTName.length > 14) {
      return NFTName.slice(0, 12) + '..'
    } else {
      return NFTName
    }
  }

  return (
    // Modify the link as needed
    <Link href={`/`}>
      <Card sx={{ cursor: 'pointer' }}>
        <CardMedia
          component='img'
          image={NFT.fileUrl}
          alt='Image not found'
          sx={{ height: { xs: 120, sm: 160, md: 220 } }}
        />
        <CardContent>
          <FlexBox>
            <div>
              <Typography
                gutterBottom
                variant='body1'
                component='div'
                sx={{ fontWeight: 300, fontSize: { xs: 14, sm: 18, md: 24 } }}
              >
                {formatNFTName(NFT.name)}
              </Typography>
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }}
              >
                {NFT.collection}
              </Typography>
            </div>
            <FlexSpace />
            <div>
              <p>Write sale info here</p>
            </div>
          </FlexBox>
        </CardContent>
      </Card>
    </Link>
  )
}

export default AccountDisplayCollection
