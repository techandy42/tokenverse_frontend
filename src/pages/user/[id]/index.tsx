/* Server-side Rendering Example */
/* Modify in the future */

/*
 * Todos:
 * reroute current user to the account page and its associated pages
 * create user page
 * update AccountMetaMaskNotConnected for all pages that need it
 */

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { usersGetByUserName } from '../../../../crudFunctions/users/usersRequests'
import { useAppSelector } from '../../../redux/app/hooks'
import { selectAccountInfo } from '../../../redux/features/accountInfoSlice'
import IUser from '../../../../interfaces/schema/IUser'
import initialUserData from '../../../../initialData/schema/initialUser'
import UserAccount from '../../../components/user/UserAccount'
import { PageType, PageWidth } from '../../../../enums/PageType'
import TextPage from '../../../components/miscellaneous/TextPage'
import emptyAddress from '../../../../constants/emptyAddress'

interface IProps {
  article: any
}

const userPage = () => {
  // fetch user info
  const accountInfo = useAppSelector(selectAccountInfo)
  const router = useRouter()

  const [userId, setUserId] = useState<null | string>(null)
  const [userData, setUserData] = useState<null | IUser>(initialUserData)

  const { id } = router.query

  console.log('id: ', id)
  console.log('userData: ', userData)

  useEffect(() => {
    if (
      userData?.address !== emptyAddress &&
      accountInfo?.account !== emptyAddress &&
      userData?.address === accountInfo?.account
    ) {
      // if it is the current user's page
      // redirect to their account
      console.log('%ccurrent user', 'color:red;font-size:2.5rem')
      router.push('/account')
    }
  }, [userData, accountInfo])

  useEffect(() => {
    const getUser = async (id: string) => {
      const fetchedUser = await usersGetByUserName(id)
      const fetchedUserData = fetchedUser && fetchedUser.data
      setUserData(fetchedUserData)
    }

    console.log('this is called')
    if (typeof id === 'string') {
      // valid id
      getUser(id)
      setUserId(id)
    } else if (id === undefined) {
      // invalid id
      // handle if id doesn't exist
      setUserData(null)
    } else {
      // valid id
      getUser(id[0])
      setUserId(id[0])
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
    return <UserAccount pageType={PageType.ALL} />
  }
}

export default userPage
