/* CRUD request functions to the back-end for nfts route */

import axios from 'axios'
import { urlNfts } from '../crudUrls'
import {
  BlockchainType,
  ErcType,
  SaleType,
  CollectibleCategory,
  ProductKeyVirtualAssetCategory,
  ProductKeyRealLifeAssetCategory,
} from '../../enums/nftMetadata'

interface INft {
  address: string
  name: string
  blockchainType: BlockchainType
  fileUrl: string
  multimediaFile: JSON | null
  tokenId: number
  itemId: number
  collection: string
  ercType: ErcType
}

interface INfts {
  address: string
  names: string[]
  blockchainType: BlockchainType
  fileUrls: string[]
  multimediaFiles: JSON[]
  tokenIds: number[]
  itemIds: number[]
  collection: string
  ercType: ErcType
}

interface INftMarketInfo {
  // data
  price: number
  isOnSale: boolean
  isOnLease: boolean
  isOnAuction: boolean
  startSaleDate: Date
  endSaleDate: Date
  // metadata
  saleType: SaleType
  collectibleCategory: CollectibleCategory
  productKeyRealLifeAssetCategory: ProductKeyRealLifeAssetCategory
  productKeyVirtualAssetCategory: ProductKeyVirtualAssetCategory
  isSensitiveContent: boolean
  descriptions: string[]
  propertiesKey: string[]
  propertiesValue: string[]
  imagesKey: string[]
  imagesValue: string[]
  levelsKey: string[]
  levelsValueNum: number[]
  levelsValueDen: number[]
}

interface INftEditInfo {
  name: string
  fileUrl: string
  multimediaFile: JSON | null
  isMetadataFrozen: boolean
  collection: string
  saleType: SaleType
  collectibleCategory: CollectibleCategory
  productKeyRealLifeAssetCategory: ProductKeyRealLifeAssetCategory
  productKeyVirtualAssetCategory: ProductKeyVirtualAssetCategory
  isSensitiveContent: boolean
  descriptions: string[]
  propertiesKey: string[]
  propertiesValue: string[]
  imagesKey: string[]
  imagesValue: string[]
  levelsKey: string[]
  levelsValueNum: number[]
  levelsValueDen: number[]
}

interface INftAddressInfo {
  address: string
}

export const nftsPost = (nft: INft) => axios.post(urlNfts, nft)
export const nftsPostMultiple = (nfts: INfts) =>
  axios.post(`${urlNfts}/multiple`, nfts)
export const nftsOnMarketPut = (
  tokenId: number,
  nftMarketInfo: INftMarketInfo,
) => axios.put(`${urlNfts}/on-market/${tokenId}`, nftMarketInfo)
export const nftsOffMarketPut = (tokenId: number) =>
  axios.put(`${urlNfts}/off-market/${tokenId}`)
export const nftsEditPut = (tokenId: number, nftEditInfo: INftEditInfo) =>
  axios.put(`${urlNfts}/edit/${tokenId}`, nftEditInfo)
export const nftsTransferPut = (
  tokenId: number,
  nftAddressInfo: INftAddressInfo,
) => axios.put(`${urlNfts}/transfer/${tokenId}`, nftAddressInfo)
export const nftsDelete = (tokenId: number) =>
  axios.delete(`${urlNfts}/${tokenId}`)
export const nftsGetAll = () => axios.get(urlNfts)
export const nftsGetOne = (tokenId: number) =>
  axios.get(`${urlNfts}/${tokenId}`)
