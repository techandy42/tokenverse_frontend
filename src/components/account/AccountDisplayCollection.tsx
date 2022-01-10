import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import IToken from '../../../interfaces/IToken'
import Link from 'next/link'
import Button from '@mui/material/Button'

interface IProps {
  collectionName: string
  NFTs: IToken[]
}

const AccountDisplayCollection: React.FC<IProps> = ({
  collectionName,
  NFTs,
}) => {
  const formatCollectionName = (collectionName: string) => {
    if (collectionName.length > 14) {
      return collectionName.slice(0, 12) + '..'
    } else {
      return collectionName
    }
  }

  return (
    <Link href='https://google.com'>
      <Card sx={{ cursor: 'pointer' }}>
        <CardMedia
          component='img'
          image={NFTs[0].image}
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
}

export default AccountDisplayCollection
