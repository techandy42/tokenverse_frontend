import {
  BlockchainType,
  SaleType,
  CollectibleCategory,
  ProductKeyAccessTokenCategory,
  ProductKeyVirtualAssetCategory,
  ErcType,
} from '../../enums/nftMetadata'
import IUser from '../schema/IUser'
import ICollection from '../schema/ICollection'
import IReview from '../schema/IReview'
import Attribute from '../../types/Attribute'

export default interface INftRelation {
  createdAt: Date
  name: string
  blockchainType: BlockchainType
  // fileUrl --> image
  // multimediaFileUrl --> animationUrl
  image: string | null
  animationUrl: string | null
  price: number
  isOnSale: boolean
  isOnLease: boolean
  isOnAuction: boolean
  isMetadataFrozen: boolean
  isSensitiveContent: boolean
  tokenId: number
  itemId: number
  startSaleDate: Date
  endSaleDate: Date
  saleType: SaleType
  collectibleCategory: CollectibleCategory
  productKeyAccessTokenCategory: ProductKeyAccessTokenCategory
  productKeyVirtualAssetCategory: ProductKeyVirtualAssetCategory
  ercType: ErcType
  likes: number
  descriptions: string[]
  // newly added fields
  images: string[]
  externalUrl: string
  youtubeUrl: string
  description: string
  attributes: Attribute[]
  //
  user?: IUser
  creator?: IUser
  collection?: ICollection
  reviews?: IReview[]
}
