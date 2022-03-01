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

const NFTCard: React.FC<IProps> = ({ NFT }) => {
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
    <Link href={`/assets/${NFT.tokenId}`}>
      <Card sx={{ cursor: 'pointer' }}>
        <CardMedia
          component='img'
          image={NFT.fileUrl}
          alt='Image not found'
          sx={{ height: { xs: 120, sm: 160, md: 200 } }}
        />
        <CardContent sx={{ height: { xs: 60, sm: 80, md: 100 } }}>
          <FlexBox
            sx={{
              paddingBottom: { xs: '0.12rem', md: '0.2rem' },
            }}
          >
            <Typography
              color='text.secondary'
              sx={{ fontSize: { xs: 10, md: 12 } }}
            >
              {NFT.collection}
            </Typography>
            <FlexSpace />
            <Typography
              color='text.secondary'
              sx={{ fontSize: { xs: 10, md: 12 } }}
            >
              {NFT.isOnSale ? 'Price' : null}
            </Typography>
          </FlexBox>
          <FlexBox>
            <Typography
              component='div'
              sx={{ fontWeight: 400, fontSize: { xs: 12, md: 16 } }}
            >
              {formatNFTName(NFT.name)}
            </Typography>
            <FlexSpace />
            <Typography
              component='div'
              sx={{ fontWeight: 400, fontSize: { xs: 12, md: 16 } }}
            >
              {NFT.isOnSale ? NFT.price : null}
            </Typography>
          </FlexBox>
        </CardContent>
      </Card>
    </Link>
  )
}

export default NFTCard
