import React from 'react'
import Account from '../../components/account/Account'
import { PageType } from '../../../enums/PageType'

const favorite = () => {
  return <Account pageType={PageType.FAVORITE} />
}

export default favorite
