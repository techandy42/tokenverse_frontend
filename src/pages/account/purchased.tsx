import React from 'react'
import Account from '../../components/account/Account'
import { PageType } from '../../../enums/PageType'

const purchased = () => {
  return <Account pageType={PageType.PURCHASED} />
}

export default purchased
