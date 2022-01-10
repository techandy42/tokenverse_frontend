import React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IToken from '../../../interfaces/IToken'

interface IProps {
  collectionName: string
  NFTs: IToken[]
}

const AccountDisplayCollection: React.FC<IProps> = ({
  collectionName,
  NFTs,
}) => {
  return (
    <Card>
      <CardMedia
        component='img'
        image={NFTs[0].image}
        alt='Image not found'
        sx={{ height: { xs: 120, sm: 160, md: 240 } }}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant='h6'
          component='div'
          sx={{ fontWeight: 300, fontSize: { xs: 16, sm: 20, md: 24 } }}
        >
          {collectionName}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {NFTs.length} items
        </Typography>
      </CardContent>
    </Card>
  )
}

export default AccountDisplayCollection
