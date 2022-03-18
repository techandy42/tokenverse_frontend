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

  return (
    <div>
      <h3>{id}</h3>
      <br />
      <Link href='/'>Go Back</Link>
    </div>
  )
}

export default userPage
