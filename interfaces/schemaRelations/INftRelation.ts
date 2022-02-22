import {
  BlockchainType,
  SaleType,
  CollectibleCategory,
  ProductKeyAccessTokenCategory,
  ProductKeyVirtualAssetCategory,
  ErcType,
} from '../../enums/nftMetadata'
import ICollection from '../schema/ICollection'
import IUser from '../schema/IUser'
import IReview from '../schema/IReview'

export default interface INft {
  createdAt: Date
  name: string
  blockchainType: BlockchainType
  fileUrl: string | null
  multimediaFileUrl: string | null
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
  propertiesKey: string[]
  propertiesValue: string[]
  imagesKey: string[]
  imagesValue: string[]
  levelsKey: string[]
  levelsValueNum: number[]
  levelsValueDen: number[]
  collection?: ICollection
  user?: IUser
  creator?: IUser
  reviews?: IReview[]
}
