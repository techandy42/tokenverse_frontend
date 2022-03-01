import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import IItem from '../../../interfaces/IItem'
import Link from 'next/link'

interface IProps {
  NFT: IItem
}

const AccountDisplayCollection: React.FC<IProps> = ({ NFT }) => {
  const formatNFTName = (NFTName: string) => {
    if (NFTName.length > 14) {
      return NFTName.slice(0, 12) + '..'
    } else {
      return NFTName
    }
  }

  console.log('NFT: ', NFT)

  /*
  return (
    <Link href={`/collection/${collectionName}`}>
      <Card sx={{ cursor: 'pointer' }}>
        <CardMedia
          component='img'
          image={NFTs[0].fileUrl}
          alt='Image not found'
          sx={{ height: { xs: 120, sm: 160, md: 220 } }}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant='h6'
            component='div'
            sx={{ fontWeight: 300, fontSize: { xs: 14, sm: 18, md: 24 } }}
          >
            {formatCollectionName(collectionName)}
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }}
          >
            {NFTs.length} items
          </Typography>
        </CardContent>
      </Card>
    </Link>
  )
  */
  return (
    <>
      <p>Hello World</p>
    </>
  )
}

export default AccountDisplayCollection
