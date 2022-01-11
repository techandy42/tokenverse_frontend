// Imported data in a nft
// name: string,
// collection: string,
// blockchainType: string,
// fileUrl: string,
// multimediaFile: any,

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
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import AccountInfo from '../components/account/AccountInfo'
import AccountNav from '../components/account/AccountNav'
import StyledPageBase from '../components/styles/StyledPageBase'
import AccountDisplayCollections from '../components/account/AccountDisplayCollections'
import loadNFTs from '../../tokenFunctions/loadNFTs'
import IToken from '../../interfaces/IToken'
import ICollectionNFTs from '../../interfaces/ICollectionNFTs'
import { styled } from '@mui/material/styles'
import { BREAKPOINT_SMALL } from '../../constants'

const TextLoading = styled('p')(({ theme }) => ({
  fontWeight: 200,
  fontSize: 18,
  marginTop: '4px',
  [theme.breakpoints.up(BREAKPOINT_SMALL)]: {
    fontSize: 22,
    marginTop: '28px',
  },
}))

const account = () => {
  const [collectionNFTs, setCollectionNFTs] = useState<ICollectionNFTs>({})
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    const getNFTs = async () => {
      const items: IToken[] = await loadNFTs()
      const groupedItems: ICollectionNFTs = groupNFTsIntoCollections(items)
      setCollectionNFTs(groupedItems)
      setLoadingState('loaded')
    }
    getNFTs()
  }, [])

  const groupNFTsIntoCollections = (items: IToken[]) => {
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

  if (loadingState === 'not-loaded')
    return (
      <StyledPageBase>
        <AccountInfo />
        <Divider sx={{ marginBottom: '1rem' }} />
        <AccountNav index={0} />
        <TextLoading>Loading...</TextLoading>
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
