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
        <Typography variant='h5' sx={{ fontWeight: 200 }}>
          Loading...
        </Typography>
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
