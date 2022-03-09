/* CRUD request functions to the back-end for nfts route */

import axios from 'axios'
import { urlNfts } from '../crudUrls'
import {
  BlockchainType,
  ErcType,
  SaleType,
  CollectibleCategory,
  ProductKeyVirtualAssetCategory,
  ProductKeyAccessTokenCategory,
} from '../../enums/nftMetadata'
import encodeTokenIds from '../../helperFunctions/encodeTokenIds'
import { IUserInfo } from '../users/usersRequests'

export interface INft {
  address: string
  name: string
  blockchainType: BlockchainType
  fileUrl: string
  multimediaFileUrl: string | null
  tokenId: number
  itemId: number
  collection: string
  ercType: ErcType
}

export interface INfts {
  address: string
  names: string[]
  blockchainType: BlockchainType
  fileUrls: string[]
  multimediaFileUrls: (string | null)[]
  tokenIds: number[]
  itemIds: number[]
  collection: string
  ercType: ErcType
}

export interface INftMarketInfo {
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
  productKeyAccessTokenCategory: ProductKeyAccessTokenCategory
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

export interface INftEditInfo {
  name: string
  fileUrl: string
  multimediaFileUrl: string | null
  isMetadataFrozen: boolean
  collection: string
  saleType: SaleType
  collectibleCategory: CollectibleCategory
  productKeyAccessTokenCategory: ProductKeyAccessTokenCategory
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

export interface INftAddressInfo {
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
export const nftsGetMultiple = (tokenIds: number[]) => {
  const tokenIdsEncoded = encodeTokenIds(tokenIds)
  return axios.get(`${urlNfts}/multiple/${tokenIdsEncoded}`)
  // return tokenIdsEncoded
}
/* like functions routes starts */
export const nftsGetLikes = (tokenId: number) =>
  axios.get(`${urlNfts}/likes/${tokenId}`)
export const nftsPutLikes = (tokenId: number, userInfo: IUserInfo) =>
  axios.put(`${urlNfts}/likes/${tokenId}`, userInfo)
export const nftsPutUnlikes = (tokenId: number, userInfo: IUserInfo) =>
  axios.put(`${urlNfts}/likes/${tokenId}`, userInfo)
/* like functions routes ends */
