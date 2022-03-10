import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import IItem from '../../../interfaces/IItem'
import Link from 'next/link'
import FlexBox from '../styles/FlexBox'
import FlexSpace from '../styles/FlexSpace'
import { useAppSelector, useAppDispatch } from '../../redux/app/hooks'
import { selectAccountInfo } from '../../redux/features/accountInfoSlice'
import {
  selectAccountData,
  updateAccountDataLikedNfts,
} from '../../redux/features/accountDataSlice'
import emptyAddress from '../../../constants/emptyAddress'
import {
  nftsGetLikes,
  nftsPutLikes,
  nftsPutUnlikes,
} from '../../../crudFunctions/nfts/nftsRequests'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CardType from '../../../enums/CardType'
import formatPersonalInfoString from '../../../helperFunctions/formatPersonalInfoString'
import IconButton from '@mui/material/IconButton'
import { IUserInfo } from '../../../crudFunctions/users/usersRequests'

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
  cardContentSizeSecond: IBreakpoints
  smallFont: IBreakpoints
  largeFont: IBreakpoints
  iconFont: IBreakpoints
  fontWeight: number
  linePaddingBottom: IBreakpoints
}

const NFTCard: React.FC<IProps> = ({ NFT, size }) => {
  const dispatch = useAppDispatch()

  const accountInfo = useAppSelector(selectAccountInfo)
  const accountData = useAppSelector(selectAccountData)

  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [initialLiked, setInitialLiked] = useState(false)

  // possible bug
  useEffect(() => {
    if (accountData.address !== emptyAddress) {
      setLiked(accountData.likedNfts.includes(NFT.tokenId))
      setInitialLiked(accountData.likedNfts.includes(NFT.tokenId))
    }
  }, [accountData])

  useEffect(() => {
    return () => {
      console.log('initialLiked: ', initialLiked)
      console.log('liked: ', liked)
      if (initialLiked === false && liked === true) {
        console.log('user liked')
      } else if (initialLiked === true && liked === false) {
        console.log('user unliked')
      }
    }
  }, [])

  /* Initializing sizes code starts */
  // intializing sizes as if size is CardType.SMALL
  let sizes: ISize = {
    cardMediaSize: { xs: 120 },
    cardContentSize: { xs: 80 },
    cardContentSizeSecond: { xs: 60 },
    smallFont: { xs: 10 },
    largeFont: { xs: 12 },
    iconFont: { xs: 'medium' },
    fontWeight: 400,
    linePaddingBottom: { xs: '0.12rem' },
  }
  // change the size if size is CardType.LARGE
  if (size === CardType.LARGE) {
    sizes = {
      ...sizes,
      cardMediaSize: { xs: 120, sm: 160, md: 200 },
      cardContentSize: { xs: 40, md: 60 },
      smallFont: { xs: 10, md: 12 },
      largeFont: { xs: 12, md: 16 },
      iconFont: { xs: 'medium', sm: 'large' },
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

  console.log('initialLiked: ', initialLiked)
  console.log('liked: ', liked)

  const handleLike = async () => {
    // cannot unlike a card with 0 or less likes
    if (liked && likes <= 0) return

    // set likes and liked
    if (liked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setLiked(!liked)

    // let newLikedNfts = []
    // if (liked) {
    //   newLikedNfts = accountData.likedNfts.filter(
    //     (tokenId) => tokenId !== NFT.tokenId,
    //   )
    // } else {
    //   newLikedNfts = [...accountData.likedNfts, NFT.tokenId]
    // }

    // console.log('newLikedNfts: ', newLikedNfts)

    // dispatch(updateAccountDataLikedNfts(newLikedNfts))

    const userInfo: IUserInfo = {
      address: accountData.address,
    }
    if (liked) {
      const result1 = await nftsPutUnlikes(NFT.tokenId, userInfo)
      console.log('result1: ', result1)
    } else {
      const result2 = await nftsPutLikes(NFT.tokenId, userInfo)
      console.log('result2: ', result2)
    }
  }

  // console.log('accountData: ', accountData)

  return (
    // Modify the link as needed
    <>
      <Card sx={{ cursor: 'pointer' }}>
        <Link href={`/assets/${NFT.tokenId}`}>
          <CardMedia
            component='img'
            image={NFT.fileUrl}
            alt='Image not found'
            sx={{ height: sizes.cardMediaSize }}
          />
        </Link>
        <Link href={`/assets/${NFT.tokenId}`}>
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
                {formatPersonalInfoString(NFT.collection, 20)}
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
                sx={{
                  fontWeight: sizes.fontWeight,
                  fontSize: sizes.largeFont,
                }}
              >
                {formatPersonalInfoString(NFT.name, 14)}
              </Typography>
              <FlexSpace />
              <Typography
                component='div'
                sx={{
                  fontWeight: sizes.fontWeight,
                  fontSize: sizes.largeFont,
                }}
              >
                {NFT.isOnSale ? NFT.price : null}
              </Typography>
            </FlexBox>
            <FlexBox>
              <FlexSpace />
              <Typography
                component='div'
                sx={{
                  fontWeight: sizes.fontWeight,
                  fontSize: sizes.largeFont,
                }}
              ></Typography>
            </FlexBox>
          </CardContent>
        </Link>
        <CardContent sx={{ height: sizes.cardContentSizeSecond }}>
          <FlexBox>
            <FlexSpace />
            <IconButton color='primary' onClick={() => handleLike()}>
              {liked ? (
                <FavoriteIcon sx={{ fontSize: sizes.iconFont }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: sizes.iconFont }} />
              )}
            </IconButton>
            <Typography>{likes}</Typography>
          </FlexBox>
        </CardContent>
      </Card>
    </>
  )
}

export default NFTCard
