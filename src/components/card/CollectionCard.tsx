import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import IItem from '../../../interfaces/IItem'
import Link from 'next/link'
import default_photo_image from '../../../images/default_photo_image.jpg'

interface IProps {
  collectionName: string
  NFTs: IItem[]
}

const CollectionCard: React.FC<IProps> = ({ collectionName, NFTs }) => {
  const formatCollectionName = (collectionName: string) => {
    if (collectionName.length > 14) {
      return collectionName.slice(0, 12) + '..'
    } else {
      return collectionName
    }
  }

  return (
    <Link href={`/collection/${collectionName}`}>
      <Card sx={{ cursor: 'pointer' }}>
        <CardMedia
          component='img'
          src={NFTs.length === 0 ? default_photo_image.src : NFTs[0].fileUrl}
          alt='Image not found'
          sx={{ height: { xs: 120, sm: 160, md: 220 } }}
        />
        <CardContent sx={{ height: { xs: 60, sm: 80, md: 100 } }}>
          <Typography
            variant='h6'
            component='div'
            sx={{
              fontWeight: 400,
              fontSize: { xs: 12, md: 20 },
              paddingBottom: { xs: '0.12rem', md: '0.2rem' },
            }}
          >
            {formatCollectionName(collectionName)}
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ fontSize: { xs: 10, md: 14 } }}
          >
            {NFTs.length} items
          </Typography>
        </CardContent>
      </Card>
    </Link>
  )
}

export default CollectionCard
