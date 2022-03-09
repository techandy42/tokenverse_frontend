import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import IItem from '../../../interfaces/IItem'
import Link from 'next/link'
import FlexBox from '../styles/FlexBox'
import FlexSpace from '../styles/FlexSpace'
import { useAppSelector } from '../../redux/app/hooks'
import { selectAccountInfo } from '../../redux/features/accountInfoSlice'
import emptyAddress from '../../../constants/emptyAddress'
import {
  nftsGetLikes,
  nftsPutLikes,
  nftsPutUnlikes,
} from '../../../crudFunctions/nfts/nftsRequests'
import { IUserInfo } from '../../../crudFunctions/users/usersRequests'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'

interface IProps {
  NFT: IItem
}

const NFTCard: React.FC<IProps> = ({ NFT }) => {
  const accountInfo = useAppSelector(selectAccountInfo)
  const [likes, setLikes] = useState(0)

  useEffect(() => {
    const getLikes = async () => {
      const fetchedNumLikes = await nftsGetLikes(NFT.tokenId)
      const numLikes = fetchedNumLikes?.data?.likes
      setLikes(numLikes ?? 0)
    }
    if (accountInfo.account !== emptyAddress) {
      getLikes()
    }
  }, [accountInfo])

  const formatNFTName = (NFTName: string) => {
    if (NFTName.length > 14) {
      return NFTName.slice(0, 12) + '..'
    } else {
      return NFTName
    }
  }

  console.log('likes: ', likes)

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
        <CardContent sx={{ height: { xs: 80, sm: 80, md: 100 } }}>
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
          <FlexBox>
            <FlexSpace />
            <Typography
              component='div'
              sx={{ fontWeight: 400, fontSize: { xs: 12, md: 16 } }}
            >
              Likes {likes}
            </Typography>
          </FlexBox>
        </CardContent>
      </Card>
    </Link>
  )
}

export default NFTCard
