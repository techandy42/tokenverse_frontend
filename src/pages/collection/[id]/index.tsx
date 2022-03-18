import React, { useState, useEffect } from 'react'
import { collectionsGet } from '../../../../crudFunctions/collections/collectionsRequests'
import { useRouter } from 'next/router'
import ICollectionRelation from '../../../../interfaces/schemaRelations/ICollectionRelation'
import initialCollection from '../../../../initialData/schema/initialCollection'
import initialUser from '../../../../initialData/schema/initialUser'
import { useAppSelector } from '../../../redux/app/hooks'
import { selectAccountInfo } from '../../../redux/features/accountInfoSlice'
import emptyAddress from '../../../../constants/emptyAddress'
import CollectionPage from '../../../components/collection/CollectionPage'
import fetchItemsByItemIds from '../../../../tokenFunctions/getters/fetchItemsByItemIds'
import IItem from '../../../../interfaces/IItem'
import INft from '../../../../interfaces/schema/INft'
import TextPage from '../../../components/miscellaneous/TextPage'
import { PageWidth } from '../../../../enums/PageType'

const initialCollectionData: ICollectionRelation = {
  ...initialCollection,
  user: initialUser,
}

const collectionPage = () => {
  // To fetch accountInfo
  const accountInfo = useAppSelector(selectAccountInfo)

  const router = useRouter()
  const { id } = router.query
  const [collectionData, setCollectionData] =
    useState<ICollectionRelation | null>(initialCollectionData)
  const [isCreator, setIsCreator] = useState(false)
  const [nfts, setNfts] = useState<IItem[]>([])
  const [collectionId, setCollectionId] = useState<null | string>(null)

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
        // checks if collectionItems is null, which prevents it from being updated
        if (collectionItems === null) return
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
      // valid id
      getCollection(id)
      setCollectionId(id)
    } else if (id === undefined) {
      // invalid id
      // handle if id doesn't exist
      setCollectionData(null)
    } else {
      // valid id
      getCollection(id[0])
      setCollectionId(id[0])
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

  if (collectionData === null) {
    // if collection does not exist
    return (
      <TextPage
        pageWidth={PageWidth.WIDE}
        hasBackButton={true}
        message='Collection does not exist'
      />
    )
  } else if (collectionData.user?.address === emptyAddress) {
    // if collection is loading
    return (
      <TextPage
        pageWidth={PageWidth.WIDE}
        hasBackButton={false}
        message='Collection is loading...'
      />
    )
  } else if (!isCreator) {
    // if collection is not owned by the user
    return (
      <CollectionPage
        isCreator={false}
        userName={collectionData.user?.userName}
        collectionId={collectionId}
        collectionData={collectionData}
        nfts={nfts}
      />
    )
  } else {
    // if collection is owned by the user
    return (
      <CollectionPage
        isCreator={true}
        userName={collectionData.user?.userName}
        collectionId={collectionId}
        collectionData={collectionData}
        nfts={nfts}
      />
    )
  }
}

export default collectionPage
