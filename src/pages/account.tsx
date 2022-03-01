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
import {
  LoadingState,
  DisplayModeChoices,
} from '../../enums/accountDisplayItem'

const TextLoading = styled('p')(({ theme }) => ({
  fontWeight: 80,
  fontSize: 16,
  marginTop: '4px',
  [theme.breakpoints.up(BREAKPOINT_SMALL)]: {
    fontSize: 18,
    marginTop: '18px',
  },
}))

const account = () => {
  // To fetch accountInfo
  const accountInfo = useAppSelector(selectAccountInfo)
  const fetchedCollectionsData = useAppSelector(selectCollections)
  const fetchedCollections: ICollection[] = fetchedCollectionsData.collections

  const [NFTs, setNFTs] = useState<IItem[]>([])
  const [collectionNFTs, setCollectionNFTs] = useState<ICollectionNFTs>({})
  const [loadingState, setLoadingState] = useState(LoadingState.NOT_LOADED)
  const [displayMode, setDisplayMode] = useState(DisplayModeChoices.NFT)

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
    if (displayMode === DisplayModeChoices.NFT) {
      setDisplayMode(DisplayModeChoices.COLLECTION)
    } else if (displayMode === DisplayModeChoices.COLLECTION) {
      setDisplayMode(DisplayModeChoices.NFT)
    } else {
      setDisplayMode(DisplayModeChoices.NFT)
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
      <Divider sx={{ marginBottom: '1rem' }} />
      <AccountNav index={0} />
      {displayMode === DisplayModeChoices.NFT ? (
        <AccountDisplayNFTs NFTs={NFTs} />
      ) : displayMode === DisplayModeChoices.COLLECTION ? (
        <AccountDisplayCollections collectionNFTs={collectionNFTs} />
      ) : (
        <AccountDisplayNFTs NFTs={NFTs} />
      )}
    </StyledPageBase>
  )
}

export default account
