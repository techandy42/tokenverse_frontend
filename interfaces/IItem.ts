import {
  BlockchainType,
  ErcType,
  SaleType,
  CollectibleCategory,
  ProductKeyAccessTokenCategory,
  ProductKeyVirtualAssetCategory,
} from '../enums/nftMetadata'
import Attribute from '../types/Attribute'

interface IItem {
  // token information
  itemId: number
  tokenId: number
  nftContract: string
  creator: string
  seller: string
  owner: string
  price: string
  isOnSale: boolean
  isOnLease: boolean
  isOnAuction: boolean
  startSaleDate: Date
  endSaleDate: Date
  tokenURI: string
  // token metadata information
  name: string
  collection: string
  blockchainType: BlockchainType
  // fileUrl --> image
  // multimedia --> animationUrl
  image: string
  animationUrl: string | null
  saleType: SaleType
  collectibleCategory: CollectibleCategory
  productKeyAccessTokenCategory: ProductKeyAccessTokenCategory
  productKeyVirtualAssetCategory: ProductKeyVirtualAssetCategory
  isSensitiveContent: boolean
  ercType: ErcType
  descriptions: string[]
  // new fields added
  images: string[]
  externalUrl: string
  youtubeUrl: string
  description: string
  attributes: Attribute[]
}

export default IItem
