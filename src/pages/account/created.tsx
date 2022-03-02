import React from 'react'
import Account from '../../components/account/Account'
import { PageType } from '../../../enums/PageType'

const created = () => {
  return <Account pageType={PageType.CREATED} />
}

export default created
