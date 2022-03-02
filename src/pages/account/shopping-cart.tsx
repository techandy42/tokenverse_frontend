import React from 'react'
import Account from '../../components/account/Account'
import { PageType } from '../../../enums/PageType'

const shoppingCart = () => {
  return <Account pageType={PageType.CART} />
}

export default shoppingCart
