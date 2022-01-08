import * as React from 'react'
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
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component='img'
        height='280'
        image={NFTs[0].image}
        alt='Image not found'
      />
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {collectionName.slice(0, 10)}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {NFTs.length}
        </Typography>
      </CardContent>
      {/* 
      <CardActions>
        <Button size='small'>Share</Button>
        <Button size='small'>Learn More</Button>
      </CardActions> */}
    </Card>
  )
}

export default AccountDisplayCollection
