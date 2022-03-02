import React from 'react'
import Account from '../components/account/Account'
import { PageType } from '../../enums/PageType'

const account = () => {
  return <Account pageType={PageType.ALL} />
}

export default account
