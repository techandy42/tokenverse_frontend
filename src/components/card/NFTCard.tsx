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
import CardType from '../../../enums/CardType'

interface IProps {
  NFT: IItem
  size: CardType
}

interface IBreakpoints {
  xs?: number | string
  sm?: number | string
  md?: number | string
  lg?: number | string
  xl?: number | string
}

interface ISize {
  cardMediaSize: IBreakpoints
  cardContentSize: IBreakpoints
  smallFont: IBreakpoints
  largeFont: IBreakpoints
  fontWeight: number
  linePaddingBottom: IBreakpoints
}

const NFTCard: React.FC<IProps> = ({ NFT, size }) => {
  const accountInfo = useAppSelector(selectAccountInfo)
  const [likes, setLikes] = useState(0)

  /* Initializing sizes code starts */
  // intializing sizes as if size is CardType.SMALL
  let sizes: ISize = {
    cardMediaSize: { xs: 120 },
    cardContentSize: { xs: 80 },
    smallFont: { xs: 10 },
    largeFont: { xs: 12 },
    fontWeight: 400,
    linePaddingBottom: { xs: '0.12rem' },
  }
  // change the size if size is CardType.LARGE
  if (size === CardType.LARGE) {
    sizes = {
      cardMediaSize: { xs: 120, sm: 160, md: 200 },
      cardContentSize: { xs: 80, sm: 80, md: 100 },
      smallFont: { xs: 10, md: 12 },
      largeFont: { xs: 12, md: 16 },
      fontWeight: 400,
      linePaddingBottom: { xs: '0.12rem', md: '0.2rem' },
    }
  }
  /* Initializing sizes code ends */

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
          sx={{ height: sizes.cardMediaSize }}
        />
        <CardContent sx={{ height: sizes.cardContentSize }}>
          <FlexBox
            sx={{
              paddingBottom: sizes.linePaddingBottom,
            }}
          >
            <Typography
              color='text.secondary'
              sx={{ fontSize: sizes.smallFont }}
            >
              {NFT.collection}
            </Typography>
            <FlexSpace />
            <Typography
              color='text.secondary'
              sx={{ fontSize: sizes.smallFont }}
            >
              {NFT.isOnSale ? 'Price' : null}
            </Typography>
          </FlexBox>
          <FlexBox>
            <Typography
              component='div'
              sx={{ fontWeight: sizes.fontWeight, fontSize: sizes.largeFont }}
            >
              {formatNFTName(NFT.name)}
            </Typography>
            <FlexSpace />
            <Typography
              component='div'
              sx={{ fontWeight: sizes.fontWeight, fontSize: sizes.largeFont }}
            >
              {NFT.isOnSale ? NFT.price : null}
            </Typography>
          </FlexBox>
          <FlexBox>
            <FlexSpace />
            <Typography
              component='div'
              sx={{ fontWeight: sizes.fontWeight, fontSize: sizes.largeFont }}
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
