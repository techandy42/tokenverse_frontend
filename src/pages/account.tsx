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
  const [collectionNFTs, setCollectionNFTs] = useState<any[]>([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    const getNFTs = async () => {
      let items: IToken[] = await loadNFTs()
      items = groupNFTsIntoCollections(items)
      setCollectionNFTs(items)
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
      {/* <Typography variant='h5' sx={{ fontWeight: 200 }}>
        Items
      </Typography> */}
      <AccountDisplayCollections collectionNFTs={collectionNFTs} />
    </StyledPageBase>
    // <div>
    //   <div className='p-4'>
    //     <h2 className='text-2xl py-2'>All Assets</h2>
    //     <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
    //       {nfts.map((nft, i) => (
    //         <div key={i} className='border shadow rounded-xl overflow-hidden'>
    //           <img src={nft.image} className='rounded' />
    //           <div className='p-4 bg-black'>
    //             <p className='text-2xl font-bold text-white'>
    //               Price - {nft.price} Eth
    //             </p>
    //             <p className='text-2xl font-bold text-white'>
    //               Name - {nft.name}
    //             </p>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>
  )
}

export default account
