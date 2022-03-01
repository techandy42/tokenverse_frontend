// Imported data in a nft
// name: string,
// collection: string,
// blockchainType: string,
// fileUrl: string,
// multimediaFileUrl: any,

// uint itemId;
// address nftContract;
// uint256 tokenId;
// address creator;
// address payable seller;
// address payable owner;
// uint256 price;
// bool onSale;
// bool frozen;

import { useEffect, useState } from 'react'
import Divider from '@mui/material/Divider'
import AccountInfo from '../components/account/AccountInfo'
import AccountNav from '../components/account/AccountNav'
import StyledPageBase from '../components/styles/StyledPageBase'
import AccountDisplayCollections from '../components/account/AccountDisplayCollections'
import IItem from '../../interfaces/IItem'
import ICollectionNFTs from '../../interfaces/ICollectionNFTs'
import ICollection from '../../interfaces/schema/ICollection'
import { styled } from '@mui/material/styles'
import { BREAKPOINT_SMALL } from '../../constants'
import { selectAccountInfo } from '../redux/features/accountInfoSlice'
import { useAppSelector } from '../redux/app/hooks'
import fetchUserOwnedItems from '../../tokenFunctions/getters/fetchUserOwnedItems'
import fetchUserCreatedItems from '../../tokenFunctions/getters/fetchUserCreatedItems'
import emptyAddress from '../../constants/emptyAddress'
import groupNFTsIntoCollections from '../../helperFunctions/account/groupNFTsIntoCollections'
import filterDuplicateItems from '../../helperFunctions/account/filterDuplicateItems'
import { selectCollections } from '../redux/features/collectionsSlice'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import AccountDisplayNFTs from '../components/account/AccountDisplayNFTs'

const TextLoading = styled('p')(({ theme }) => ({
  fontWeight: 80,
  fontSize: 16,
  marginTop: '4px',
  [theme.breakpoints.up(BREAKPOINT_SMALL)]: {
    fontSize: 18,
    marginTop: '18px',
  },
}))

enum LoadingState {
  LOADED = 'LOADED',
  NOT_LOADED = 'NOT_LOADED',
}

enum displayModeChoices {
  NFT = 'NFT',
  COLLECTION = 'COLLECTION',
}

const account = () => {
  // To fetch accountInfo
  const accountInfo = useAppSelector(selectAccountInfo)
  const fetchedCollectionsData = useAppSelector(selectCollections)
  const fetchedCollections: ICollection[] = fetchedCollectionsData.collections

  const [NFTs, setNFTs] = useState<IItem[]>([])
  const [collectionNFTs, setCollectionNFTs] = useState<ICollectionNFTs>({})
  const [loadingState, setLoadingState] = useState(LoadingState.NOT_LOADED)
  const [displayMode, setDisplayMode] = useState(displayModeChoices.NFT)

  console.log('collectionNFTs: ', collectionNFTs)

  interface ICollectionUuidToName {
    [key: string]: string
  }

  const renameNFTsCollectionUuidToName = (
    items: IItem[],
    collections: ICollection[],
  ) => {
    const collectionUuidToName: ICollectionUuidToName = {}
    for (const collection of collections) {
      collectionUuidToName[collection.uuid] = collection.name
    }
    for (const item of items) {
      if (collectionUuidToName[item.collection] !== undefined) {
        item.collection = collectionUuidToName[item.collection]
      }
    }
    return items
  }

  useEffect(() => {
    const getNFTs = async () => {
      const userCreatedItems: IItem[] | null = await fetchUserCreatedItems(
        accountInfo.account,
      )
      const userOwnedItems: IItem[] | null = await fetchUserOwnedItems(
        accountInfo.account,
      )
      const userItems: IItem[] | null = filterDuplicateItems(
        userCreatedItems,
        userOwnedItems,
      )
      if (userItems !== null) {
        const collectionUuidToNameItems: IItem[] =
          renameNFTsCollectionUuidToName(userItems, fetchedCollections)
        const groupedItems: ICollectionNFTs = groupNFTsIntoCollections(
          collectionUuidToNameItems,
        )
        console.log('accountInfo.account: ', accountInfo.account)
        console.log('fetchedCollections: ', fetchedCollections)
        console.log('userItems: ', userItems)
        console.log('groupedItems: ', groupedItems)
        setNFTs(collectionUuidToNameItems)
        setCollectionNFTs(groupedItems)
      }
      setLoadingState(LoadingState.LOADED)
    }
    if (
      accountInfo.account !== emptyAddress &&
      fetchedCollections.length !== 0
    ) {
      getNFTs()
    }
  }, [accountInfo, fetchedCollections])

  const handleDisplayMode = () => {
    if (displayMode === displayModeChoices.NFT) {
      setDisplayMode(displayModeChoices.COLLECTION)
    } else if (displayMode === displayModeChoices.COLLECTION) {
      setDisplayMode(displayModeChoices.NFT)
    } else {
      setDisplayMode(displayModeChoices.NFT)
    }
  }

  if (loadingState === LoadingState.NOT_LOADED)
    return (
      <StyledPageBase>
        <AccountInfo />
        <Divider sx={{ marginBottom: '1rem' }} />
        <AccountNav index={0} />
        <TextLoading className='font-chakra'>Loading...</TextLoading>
      </StyledPageBase>
    )

  return (
    <StyledPageBase>
      <AccountInfo />
      <FormControlLabel
        control={<Switch onClick={() => handleDisplayMode()} />}
        label='Collection'
      />
      <div></div>
      <Divider sx={{ marginBottom: '1rem' }} />
      <AccountNav index={0} />
      {displayMode === displayModeChoices.NFT ? (
        <AccountDisplayNFTs NFTs={NFTs} />
      ) : displayMode === displayModeChoices.COLLECTION ? (
        <AccountDisplayCollections collectionNFTs={collectionNFTs} />
      ) : (
        <AccountDisplayNFTs NFTs={NFTs} />
      )}
    </StyledPageBase>
  )
}

export default account
