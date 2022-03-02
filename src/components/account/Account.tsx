import { useEffect, useState } from 'react'
import Divider from '@mui/material/Divider'
import AccountInfo from '../../components/account/AccountInfo'
import AccountNav from '../../components/account/AccountNav'
import StyledPageBase from '../../components/styles/StyledPageBase'
import AccountDisplayCollections from '../../components/account/AccountDisplayCollections'
import IItem from '../../../interfaces/IItem'
import ICollectionNFTs from '../../../interfaces/ICollectionNFTs'
import ICollection from '../../../interfaces/schema/ICollection'
import { styled } from '@mui/material/styles'
import { BREAKPOINT_SMALL } from '../../../constants'
import { selectAccountInfo } from '../../redux/features/accountInfoSlice'
import { useAppSelector } from '../../redux/app/hooks'
import fetchUserOwnedItems from '../../../tokenFunctions/getters/fetchUserOwnedItems'
import fetchUserCreatedItems from '../../../tokenFunctions/getters/fetchUserCreatedItems'
import emptyAddress from '../../../constants/emptyAddress'
import groupNFTsIntoCollections from '../../../helperFunctions/account/groupNFTsIntoCollections'
import filterDuplicateItems from '../../../helperFunctions/account/filterDuplicateItems'
import { selectCollections } from '../../redux/features/collectionsSlice'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import AccountDisplayNFTs from '../../components/account/AccountDisplayNFTs'
import {
  LoadingState,
  DisplayModeChoices,
} from '../../../enums/accountDisplayItem'
import { PageType } from '../../../enums/PageType'
import {
  usersLikedGet,
  usersCartGet,
} from '../../../crudFunctions/users/usersRequests'
import { nftsGetMultiple } from '../../../crudFunctions/nfts/nftsRequests'
import fetchItemsByItemIds from '../../../tokenFunctions/getters/fetchItemsByItemIds'
import INftRelation from '../../../interfaces/schemaRelations/INftsRelation'

interface IProps {
  pageType: PageType
}

const TextLoading = styled('p')(({ theme }) => ({
  fontWeight: 80,
  fontSize: 16,
  marginTop: '4px',
  [theme.breakpoints.up(BREAKPOINT_SMALL)]: {
    fontSize: 18,
    marginTop: '18px',
  },
}))

const Account: React.FC<IProps> = ({ pageType }) => {
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
      let userCreatedItems: IItem[] | null = null
      let userOwnedItems: IItem[] | null = null
      let userItems: IItem[] | null = null
      if (pageType === PageType.ALL || pageType === PageType.CREATED) {
        userCreatedItems = await fetchUserCreatedItems(accountInfo.account)
      }
      if (pageType === PageType.ALL || pageType === PageType.PURCHASED) {
        userOwnedItems = await fetchUserOwnedItems(accountInfo.account)
      }
      if (pageType === PageType.ALL) {
        userItems = filterDuplicateItems(userCreatedItems, userOwnedItems)
      } else if (pageType === PageType.CREATED) {
        userItems = userCreatedItems
      } else if (pageType === PageType.PURCHASED) {
        userItems = userOwnedItems
      } else if (pageType === PageType.CART) {
        // fetch user cart items
        const fetchedUserCartItems = await usersCartGet(accountInfo.account)
        const fetchedUserCartItemsData: number[] =
          fetchedUserCartItems === undefined ? null : fetchedUserCartItems.data
        let fetchedCartNFTs = null
        if (fetchedUserCartItemsData.length !== 0) {
          fetchedCartNFTs = await nftsGetMultiple(fetchedUserCartItemsData)
          fetchedCartNFTs =
            fetchedCartNFTs === undefined ? null : fetchedCartNFTs
        }
        userItems =
          fetchedCartNFTs === null
            ? null
            : await fetchItemsByItemIds(
                fetchedCartNFTs.data.map((NFT: INftRelation) => NFT.itemId),
              )
      } else if (pageType === PageType.FAVORITE) {
        // fetch user liked items
        const fetchedUserLikedItems = await usersLikedGet(accountInfo.account)
        const fetchedUserLikedItemsData: number[] =
          fetchedUserLikedItems === undefined
            ? null
            : fetchedUserLikedItems.data
        let fetchedLikedNFTs = null
        if (fetchedUserLikedItemsData.length !== 0) {
          fetchedLikedNFTs = await nftsGetMultiple(fetchedUserLikedItemsData)
          fetchedLikedNFTs =
            fetchedLikedNFTs === undefined ? null : fetchedLikedNFTs
        }
        userItems =
          fetchedLikedNFTs === null
            ? null
            : await fetchItemsByItemIds(
                fetchedLikedNFTs.data.map((NFT: INftRelation) => NFT.itemId),
              )
      } else {
        userItems = filterDuplicateItems(userCreatedItems, userOwnedItems)
      }
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

  const getPageTypeIndex = (pageType: PageType) => {
    if (pageType === PageType.ALL) {
      return 0
    } else if (pageType === PageType.CREATED) {
      return 1
    } else if (pageType === PageType.PURCHASED) {
      return 2
    } else if (pageType === PageType.CART) {
      return 3
    } else if (pageType === PageType.FAVORITE) {
      return 4
    } else {
      return 0
    }
  }

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
        <AccountNav index={getPageTypeIndex(pageType)} />
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
      <AccountNav index={getPageTypeIndex(pageType)} />
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

export default Account
