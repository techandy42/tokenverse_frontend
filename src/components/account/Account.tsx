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
import { selectAccountData } from '../../redux/features/accountDataSlice'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import AccountDisplayNFTs from '../../components/account/AccountDisplayNFTs'
import {
  LoadingState,
  DisplayModeChoices,
} from '../../../enums/accountDisplayItem'
import { PageType } from '../../../enums/PageType'
import {
  usersGetLikedNfts,
  usersGetCartNfts,
} from '../../../crudFunctions/users/usersRequests'
import { nftsGetMultiple } from '../../../crudFunctions/nfts/nftsRequests'
import fetchItemsByItemIds from '../../../tokenFunctions/getters/fetchItemsByItemIds'
import INftRelation from '../../../interfaces/schemaRelations/INftsRelation'
import { AccountNavType } from '../../../enums/PageType'

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

interface ICollectionUuidToName {
  [key: string]: string
}

const Account: React.FC<IProps> = ({ pageType }) => {
  // To fetch accountInfo
  const accountInfo = useAppSelector(selectAccountInfo)
  const accountData = useAppSelector(selectAccountData)
  const fetchedCollectionsData = useAppSelector(selectCollections)
  const fetchedCollections: ICollection[] = fetchedCollectionsData.collections

  const [NFTs, setNFTs] = useState<IItem[]>([])
  const [collectionNFTs, setCollectionNFTs] = useState<ICollectionNFTs>({})
  const [loadingState, setLoadingState] = useState(LoadingState.NOT_LOADED)
  const [displayMode, setDisplayMode] = useState(DisplayModeChoices.NFT)

  console.log('accountData: ', accountData)

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
      if (
        accountInfo.account === emptyAddress ||
        accountData.address === emptyAddress ||
        fetchedCollections.length === 0
      )
        return

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
        const cartNftsRequestInfo = await usersGetCartNfts(accountInfo.account)
        const cartNfts = cartNftsRequestInfo.data.cartNfts
        if (cartNfts.length === 0) {
          userItems = null
        } else {
          let fetchedCartNFTs = await nftsGetMultiple(cartNfts)
          console.log('fetchedCartNFTs: ', fetchedCartNFTs)
          fetchedCartNFTs =
            fetchedCartNFTs === undefined ? null : fetchedCartNFTs
          userItems =
            fetchedCartNFTs === null
              ? null
              : await fetchItemsByItemIds(
                  fetchedCartNFTs.data.map((NFT: INftRelation) => NFT.itemId),
                )
        }
      } else if (pageType === PageType.FAVORITE) {
        // fetch user liked items
        const likedNftsRequestInfo = await usersGetLikedNfts(
          accountInfo.account,
        )
        const likedNfts = likedNftsRequestInfo.data.likedNfts
        if (likedNfts.length === 0) {
          userItems = null
        } else {
          let fetchedLikedNFTs = await nftsGetMultiple(likedNfts)
          console.log('fetchedCartNFTs: ', fetchedLikedNFTs)
          fetchedLikedNFTs =
            fetchedLikedNFTs === undefined ? null : fetchedLikedNFTs
          userItems =
            fetchedLikedNFTs === null
              ? null
              : await fetchItemsByItemIds(
                  fetchedLikedNFTs.data.map((NFT: INftRelation) => NFT.itemId),
                )
        }
      } else {
        userItems = filterDuplicateItems(userCreatedItems, userOwnedItems)
      }
      // group NFTs into collections
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
      accountData.address !== emptyAddress &&
      fetchedCollections.length !== 0
    ) {
      // resetting NFTs data
      setNFTs([])
      setCollectionNFTs({})
      // fetching NFTs from smart contract
      getNFTs()
    }
  }, [accountInfo, accountData, fetchedCollections])

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

  return (
    <StyledPageBase>
      <AccountInfo />
      {loadingState !== LoadingState.NOT_LOADED && (
        <>
          <FormControlLabel
            control={<Switch onClick={() => handleDisplayMode()} />}
            label='Collection'
          />
        </>
      )}
      <Divider sx={{ marginBottom: '1rem' }} />
      <AccountNav
        index={getPageTypeIndex(pageType)}
        accountNavType={AccountNavType.OWN_ACCOUNT}
      />
      {loadingState === LoadingState.NOT_LOADED ? (
        <>
          <TextLoading className='font-chakra'>Loading...</TextLoading>
        </>
      ) : (
        <>
          {displayMode === DisplayModeChoices.NFT ? (
            <AccountDisplayNFTs NFTs={NFTs} />
          ) : displayMode === DisplayModeChoices.COLLECTION ? (
            <AccountDisplayCollections collectionNFTs={collectionNFTs} />
          ) : (
            <AccountDisplayNFTs NFTs={NFTs} />
          )}
        </>
      )}
    </StyledPageBase>
  )
}

export default Account
