/*
 * Todos:
 * reroute current user to the account page and its associated pages
 * create user page
 * update AccountMetaMaskNotConnected for all pages that need it
 */

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { usersGetByUserName } from '../../../../crudFunctions/users/usersRequests'
import { useAppSelector } from '../../../redux/app/hooks'
import { selectAccountInfo } from '../../../redux/features/accountInfoSlice'
import IUser from '../../../../interfaces/schema/IUser'
import initialUserData from '../../../../initialData/schema/initialUser'
import UserAccount from '../../../components/user/UserAccount'
import { PageType, PageWidth } from '../../../../enums/PageType'
import TextPage from '../../../components/miscellaneous/TextPage'
import emptyAddress from '../../../../constants/emptyAddress'
import UserPage from '../../../components/user/UserPage'

const userPage = () => {
  const router = useRouter()
  // fetch page id
  const { id } = router.query

  return <UserPage id={id} pageType={PageType.ALL} />
}

export default userPage
