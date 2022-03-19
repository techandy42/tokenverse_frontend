import React from 'react'
import { useRouter } from 'next/router'
import { PageType } from '../../../../enums/PageType'
import UserPage from '../../../components/user/UserPage'

const userPage = () => {
  const router = useRouter()
  // fetch page id
  const { id } = router.query

  return <UserPage id={id} pageType={PageType.PURCHASED} />
}

export default userPage
