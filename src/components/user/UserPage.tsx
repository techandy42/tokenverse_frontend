import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  usersGetByUserName,
  usersCollectionsGet,
} from '../../../crudFunctions/users/usersRequests'
import { useAppSelector } from '../../redux/app/hooks'
import { selectAccountInfo } from '../../redux/features/accountInfoSlice'
import IUser from '../../../interfaces/schema/IUser'
import ICollection from '../../../interfaces/schema/ICollection'
import initialUserData from '../../../initialData/schema/initialUser'
import UserAccount from '../../components/user/UserAccount'
import { PageType, PageWidth } from '../../../enums/PageType'
import TextPage from '../../components/miscellaneous/TextPage'
import emptyAddress from '../../../constants/emptyAddress'

interface IProps {
  id: string | string[] | undefined
  pageType: PageType
}

const UserPage: React.FC<IProps> = ({ id, pageType }) => {
  // fetch user info
  const accountInfo = useAppSelector(selectAccountInfo)
  const router = useRouter()

  const [userData, setUserData] = useState<null | IUser>(initialUserData)
  const [fetchedCollections, setFetchedCollections] = useState<ICollection[]>(
    [],
  )

  useEffect(() => {
    if (
      userData?.address !== emptyAddress &&
      accountInfo?.account !== emptyAddress &&
      userData?.address === accountInfo?.account
    ) {
      // if it is the current user's page
      // redirect to their account
      router.push('/account')
    }
  }, [userData, accountInfo])

  useEffect(() => {
    const getUser = async (id: string) => {
      // get user data
      const fetchedUser = await usersGetByUserName(id)
      const fetchedUserData: null | IUser = fetchedUser && fetchedUser.data
      setUserData(fetchedUserData)

      if (fetchedUserData === null) return

      // get user collection data if userData is not null
      const collections = await usersCollectionsGet(fetchedUserData.address)
      let collectionsData: null | ICollection[] =
        collections && collections.data && collections.data.collections
      collectionsData = collectionsData === null ? [] : collectionsData
      setFetchedCollections(collectionsData)
    }

    if (typeof id === 'string') {
      // valid id
      getUser(id)
    } else if (id === undefined) {
      // invalid id
      // handle if id doesn't exist
      setUserData(null)
    } else {
      // valid id
      getUser(id[0])
    }
  }, [id])

  if (userData === null) {
    // if user info does not exist
    return (
      <TextPage
        pageWidth={PageWidth.WIDE}
        hasBackButton={true}
        message='User Info does not exist'
      />
    )
  } else if (userData.address === emptyAddress) {
    // if user info is loading
    return (
      <TextPage
        pageWidth={PageWidth.WIDE}
        hasBackButton={false}
        message='User Info is loading...'
      />
    )
  } else {
    // if user page is not the current user's
    return (
      <UserAccount
        userData={userData}
        fetchedCollections={fetchedCollections}
        pageType={pageType}
        id={id}
      />
    )
  }
}

export default UserPage
