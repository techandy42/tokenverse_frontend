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

  useEffect(() => {
    const getCollection = async (id: string) => {
      // fetch collection from the back-end
      const fetchedCollection = await collectionsGet(id)
      if (fetchedCollection.data !== null) {
        // collection exists
        setCollectionData(fetchedCollection.data)
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
  /*
  console.log('isCreator: ', isCreator)
  console.log('accountInfo.account: ', accountInfo.account)
  console.log('collectionData.user?.address: ', collectionData.user?.address)
  */
  /* Remove ends */

  if (collectionData === null) {
    return <div>Collection does not exist</div>
  } else if (collectionData.user?.address === emptyAddress) {
    return <div>Collection has not loaded yet</div>
  } else if (!isCreator) {
    return <div>I'm not the creator</div>
  } else {
    return <div>I'm the creator</div>
  }
}

export default collectionPage
