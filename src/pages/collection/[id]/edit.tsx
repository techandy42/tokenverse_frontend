import React, { useState, useEffect } from 'react'
import { useAppSelector } from '../../../redux/app/hooks'
import { selectAccountInfo } from '../../../redux/features/accountInfoSlice'
import { useRouter } from 'next/router'
import emptyAddress from '../../../../constants/emptyAddress'
import { collectionsGet } from '../../../../crudFunctions/collections/collectionsRequests'
import CollectionEdit from '../../../components/collection/CollectionEdit'
import TextPage from '../../../components/miscellaneous/TextPage'
import { PageWidth } from '../../../../enums/PageType'

export interface ICollectionInfo {
  userAddress: string
  newName: string
  image: string | null
  description: string
}

const initialCollectionInfo: ICollectionInfo = {
  userAddress: emptyAddress,
  newName: '',
  image: null,
  description: '',
}

const edit = () => {
  const router = useRouter()
  const { id } = router.query
  const accountInfo = useAppSelector(selectAccountInfo)

  const [collectionInfo, setCollectionInfo] = useState<ICollectionInfo | null>(
    initialCollectionInfo,
  )
  const [originalCollectionName, setOriginalCollectionName] = useState<
    null | string
  >(null)
  const [collectionId, setCollectionId] = useState<null | string>(null)
  const [isCreator, setIsCreator] = useState(false)

  console.log('id: ', id)
  console.log('collectionInfo: ', collectionInfo)

  useEffect(() => {
    const getCollection = async (id: string) => {
      const fetchedCollection = await collectionsGet(id)
      if (fetchedCollection.data !== null) {
        // collection exists
        const data: ICollectionInfo = {
          userAddress: fetchedCollection.data.user?.address,
          newName: fetchedCollection.data.name,
          image: fetchedCollection.data.image,
          description: fetchedCollection.data.description,
        }
        setCollectionInfo(data)
        setOriginalCollectionName(fetchedCollection.data.name)
      } else {
        setCollectionInfo(null)
        setOriginalCollectionName(null)
      }
    }

    if (typeof id === 'string') {
      // valid id
      getCollection(id)
      setCollectionId(id)
    } else if (id === undefined) {
      // invalid id
      // handle if id doesn't exist
      setCollectionInfo(null)
    } else {
      // valid id
      getCollection(id[0])
      setCollectionId(id[0])
    }
  }, [id])

  useEffect(() => {
    if (
      accountInfo.account !== emptyAddress &&
      collectionInfo !== null &&
      collectionInfo.userAddress !== emptyAddress
    ) {
      /*
       * accountInfo has been updated
       * collection exists
       * collectionData has been updated
       */
      if (accountInfo.account === collectionInfo?.userAddress) {
        setIsCreator(true)
      } else {
        setIsCreator(false)
      }
    }
  }, [accountInfo, collectionInfo])

  if (
    collectionId === null ||
    collectionInfo === null ||
    originalCollectionName === null
  ) {
    // if collection does not exist
    return (
      <TextPage
        pageWidth={PageWidth.NARROW}
        hasBackButton={true}
        message='Collection does not exist'
      />
    )
  } else if (collectionInfo.userAddress === emptyAddress) {
    return (
      <TextPage
        pageWidth={PageWidth.NARROW}
        hasBackButton={false}
        message='Collection is loading...'
      />
    )
  } else if (!isCreator) {
    return (
      <TextPage
        pageWidth={PageWidth.NARROW}
        hasBackButton={true}
        message='You do not own this collection'
      />
    )
  } else {
    return (
      <CollectionEdit
        collectionInfo={collectionInfo}
        setCollectionInfo={setCollectionInfo}
        originalCollectionName={originalCollectionName}
        collectionId={collectionId}
        isCreator={isCreator}
      />
    )
  }
}

export default edit
