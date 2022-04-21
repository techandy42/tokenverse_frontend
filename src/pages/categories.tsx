import React, { useState, useEffect } from 'react'
import { collectionsGetAll } from '../../crudFunctions/collections/collectionsRequests'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import NFTCard from '../components/card/NFTCard'
import CardType from '../../enums/CardType'
import emptyAddress from '../../constants/emptyAddress'
import { usersGetLikedNfts } from '../../crudFunctions/users/usersRequests'
import { useAppSelector } from '../redux/app/hooks'
import { selectAccountInfo } from '../redux/features/accountInfoSlice'
import StyledPageBase from '../components/styles/StyledPageBase'
import AccountDisplayNFTs from '../components/account/AccountDisplayNFTs'
import AccountDisplayCollections from '../components/account/AccountDisplayCollections'

const Categories = () => {
  const accountInfo = useAppSelector(selectAccountInfo)
  const [likedNfts, setLikedNfts] = useState<number[]>([])
  const [isLikedNftsLoaded, setIsLikedNftsLoaded] = useState(0)
  const [collections, setCollections] = useState({})
  const [nfts, setNfts] = useState<any[]>([])
  const [switchValue, setSwitchValue] = useState(false)

  console.log('collections: ', collections)

  const nameContainWords = (name: string, words: string[]) => {
    const nameLower = name.toLowerCase()
    let containsAtLeastOneWord = false
    for (const word of words) {
      if (nameLower.includes(word)) {
        containsAtLeastOneWord = true
      }
    }
    console.log(containsAtLeastOneWord)
    return containsAtLeastOneWord
  }

  const getCollections = async (words: string[]) => {
    const fetchedCollections = await collectionsGetAll()
    let cleanedCollections = fetchedCollections.data
    let nfts = []
    for (let i = 0; i < cleanedCollections.length; i++) {
      for (let j = 0; j < cleanedCollections[i].nfts.length; j++) {
        const modNft = {
          ...cleanedCollections[i].nfts[j],
          collection: cleanedCollections[i].name,
        }
        nfts.push(modNft)
      }
    }
    cleanedCollections = cleanedCollections.filter((collection: any) =>
      nameContainWords(collection.name, words),
    )
    const modCollections = {}
    for (const collection of cleanedCollections) {
      modCollections[collection.name] = collection.nfts
    }
    nfts = nfts.filter((nft) => nameContainWords(nft.name, words))
    setCollections(modCollections)
    setNfts(nfts)
    console.log('words: ', words)
  }

  useEffect(() => {
    const url = window.location.href
    const query: string | undefined = url.split('=')[1]
    const words = query === undefined ? [''] : query.split('%20')
    getCollections(words)
  }, [])

  useEffect(() => {
    const getLikedNfts = async () => {
      const likedNftsRequestInfo = await usersGetLikedNfts(accountInfo.account)
      const likedNfts = likedNftsRequestInfo.data.likedNfts
      setLikedNfts(likedNfts)
      setIsLikedNftsLoaded(isLikedNftsLoaded + 1)
    }

    if (accountInfo.account !== emptyAddress) {
      getLikedNfts()
    }
  }, [accountInfo])

  const displayCollections = () => {
    if (collections.length === 0)
      return (
        <div>
          <Typography className='font-chakra' variant='h4'>
            No Collections Found
          </Typography>
        </div>
      )
    return <AccountDisplayCollections collectionNFTs={collections} />
  }

  const displayNfts = () => {
    if (nfts.length === 0)
      return (
        <div>
          <Typography className='font-chakra' variant='h4'>
            No NFTs Found
          </Typography>
        </div>
      )
    return <AccountDisplayNFTs NFTs={nfts} />
  }

  return (
    <div>
      <Stack
        direction='row'
        spacing={1}
        alignItems='center'
        sx={{ marginLeft: '2.5rem', marginBottom: '1rem' }}
      >
        <Typography>Collections</Typography>
        <Switch
          value={switchValue}
          onClick={() => setSwitchValue(!switchValue)}
        />
        <Typography>NFTs</Typography>
      </Stack>
      <Divider />
      <StyledPageBase>
        {!switchValue ? displayCollections() : displayNfts()}
      </StyledPageBase>
    </div>
  )
}

export default Categories
