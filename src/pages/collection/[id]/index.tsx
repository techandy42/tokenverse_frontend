import React, { useState, useEffect } from 'react'
import { collectionsGet } from '../../../../crudFunctions/collections/collectionsRequests'
import { useRouter } from 'next/router'
import ICollectionRelation from '../../../../interfaces/schemaRelations/ICollectionRelation'
import initialCollection from '../../../../initialData/schema/initialCollection'
import initialUser from '../../../../initialData/schema/initialUser'
import { useAppDispatch, useAppSelector } from '../../../redux/app/hooks'
import {
  updateAccount,
  updateEtherBalance,
  updateNetworkId,
  selectAccountInfo,
  AccountInfoState,
} from '../../../redux/features/accountInfoSlice'
import emptyAddress from '../../../../constants/emptyAddress'
import StyledWidePageBase from '../../../components/styles/StyledWidePageBase'
import { Button, Typography } from '@mui/material'
import CollectionPage from '../../../components/collection/CollectionPage'
import fetchItemsByItemIds from '../../../../tokenFunctions/getters/fetchItemsByItemIds'
import IItem from '../../../../interfaces/IItem'
import INft from '../../../../interfaces/schema/INft'

const initialCollectionData: ICollectionRelation = {
  ...initialCollection,
  user: initialUser,
}

const collectionPage = () => {
  const dispatch = useAppDispatch()
  // To fetch accountInfo
  const accountInfo = useAppSelector(selectAccountInfo)

  const router = useRouter()
  const { id } = router.query
  const [collectionData, setCollectionData] =
    useState<ICollectionRelation | null>(initialCollectionData)
  const [isCreator, setIsCreator] = useState(false)
  const [nfts, setNfts] = useState<IItem[]>([])

  console.log('collectionData: ', collectionData)

  useEffect(() => {
    const getCollection = async (id: string) => {
      // fetch collection from the back-end
      const fetchedCollection = await collectionsGet(id)
      if (fetchedCollection.data !== null) {
        // collection exists
        setCollectionData(fetchedCollection.data)
        const collectionNFTItemIds = fetchedCollection.data.nfts.map(
          (nft: INft) => nft.itemId,
        )
        const collectionItems: IItem[] | null = await fetchItemsByItemIds(
          collectionNFTItemIds,
        )
        for (const collectionItem of collectionItems) {
          collectionItem.collection = fetchedCollection.data?.name
        }
        if (collectionItems !== null) {
          setNfts(collectionItems)
        }
      } else {
        // collection doesn't exist
        setCollectionData(null)
      }
    }

    if (typeof id === 'string') {
      getCollection(id)
    } else if (id === undefined) {
      // handle if id doesn't exist
      setCollectionData(null)
    } else {
      getCollection(id[0])
    }
  }, [id])

  useEffect(() => {
    if (
      accountInfo.account !== emptyAddress &&
      collectionData !== null &&
      collectionData.user?.address !== emptyAddress
    ) {
      /*
       * accountInfo has been updated
       * collection exists
       * collectionData has been updated
       */
      if (accountInfo.account === collectionData.user?.address) {
        setIsCreator(true)
      } else {
        setIsCreator(false)
      }
    }
  }, [accountInfo, collectionData])

  /* Remove starts */
  console.log('id: ', id)
  console.log('collectionData: ', collectionData)
  /* Remove ends */

  if (collectionData === null) {
    // if collection does not exist
    return (
      <StyledWidePageBase>
        <Typography variant='h4' className='font-chakra'>
          Collection does not exist
        </Typography>
        <Button onClick={() => router.back()}>Go Back</Button>
      </StyledWidePageBase>
    )
  } else if (collectionData.user?.address === emptyAddress) {
    // if collection is loading
    return (
      <StyledWidePageBase>
        <Typography variant='h4' className='font-chakra'>
          Collection is loading...
        </Typography>
      </StyledWidePageBase>
    )
  } else if (!isCreator) {
    // if collection is not owned by the user
    return (
      <CollectionPage
        isCreator={false}
        collectionData={collectionData}
        nfts={nfts}
      />
    )
  } else {
    // if collection is owned by the user
    return (
      <CollectionPage
        isCreator={true}
        collectionData={collectionData}
        nfts={nfts}
      />
    )
  }
}

export default collectionPage
