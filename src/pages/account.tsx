// Imported data in a nft
// name: string,
// collection: string,
// blockchainType: string,
// fileUrl: string,
// multimediaFileUrl: any,

// uint itemId;
// address nftContract;
// uint256 tokenId;
// address creator;
// address payable seller;
// address payable owner;
// uint256 price;
// bool onSale;
// bool frozen;

import { useEffect, useState } from 'react'
import Divider from '@mui/material/Divider'
import AccountInfo from '../components/account/AccountInfo'
import AccountNav from '../components/account/AccountNav'
import StyledPageBase from '../components/styles/StyledPageBase'
import AccountDisplayCollections from '../components/account/AccountDisplayCollections'
import loadNFTs from '../../tokenFunctions/getters/loadNFTs'
import IToken from '../../interfaces/IToken'
import ICollectionNFTs from '../../interfaces/ICollectionNFTs'
import { styled } from '@mui/material/styles'
import { BREAKPOINT_SMALL } from '../../constants'
import { selectAccountInfo } from '../redux/features/accountInfoSlice'
import { useAppSelector } from '../redux/app/hooks'
import INft from '../../interfaces/schema/INft'
import ICollection from '../../interfaces/schema/ICollection'

const TextLoading = styled('p')(({ theme }) => ({
  fontWeight: 80,
  fontSize: 16,
  marginTop: '4px',
  [theme.breakpoints.up(BREAKPOINT_SMALL)]: {
    fontSize: 18,
    marginTop: '18px',
  },
}))

enum LoadingState {
  LOADED = 'LOADED',
  NOT_LOADED = 'NOT_LOADED',
}

const groupNFTsIntoCollections = (items: any[]) => {
  const collectionNFTs: ICollectionNFTs = {}
  for (const item of items) {
    if (!collectionNFTs.hasOwnProperty(item.collection)) {
      collectionNFTs[item.collection] = [item]
    } else {
      collectionNFTs[item.collection] = [
        ...collectionNFTs[item.collection],
        item,
      ]
    }
  }
  return collectionNFTs
}

/*
const groupNFTsIntoCollections = (nfts: INft[], collections: ICollection[]) => {
  return nfts
}
*/

const account = () => {
  // To fetch accountInfo
  const accountInfo = useAppSelector(selectAccountInfo)

  const [collectionNFTs, setCollectionNFTs] = useState<ICollectionNFTs>({})
  const [loadingState, setLoadingState] = useState(LoadingState.NOT_LOADED)

  useEffect(() => {
    const getNFTs = async () => {
      const items = await loadNFTs()
      console.log('items[0]', items[0])
      if (items !== null) {
        const groupedItems: ICollectionNFTs = groupNFTsIntoCollections(items)
        console.log('groupedItems: ', groupedItems)
        setCollectionNFTs(groupedItems)
      }
      setLoadingState(LoadingState.LOADED)
    }
    getNFTs()
  }, [accountInfo])

  if (loadingState === LoadingState.NOT_LOADED)
    return (
      <StyledPageBase>
        <AccountInfo />
        <Divider sx={{ marginBottom: '1rem' }} />
        <AccountNav index={0} />
        <TextLoading className='font-chakra'>Loading...</TextLoading>
      </StyledPageBase>
    )

  return (
    <StyledPageBase>
      <AccountInfo />
      <Divider sx={{ marginBottom: '1rem' }} />
      <AccountNav index={0} />
      <AccountDisplayCollections collectionNFTs={collectionNFTs} />
    </StyledPageBase>
  )
}

export default account
