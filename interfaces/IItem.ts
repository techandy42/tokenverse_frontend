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
  collection: string
  startSaleDate: Date
  endSaleDate: Date
  tokenURI: string
  // token metadata information
  image: string
  animationUrl: string | null
  externalUrl: string
  youtubeUrl: string
  description: string
  name: string
  attributes: Attribute[]
  // back-end informations
  blockchainType: BlockchainType | null
  saleType: SaleType | null
  collectibleCategory: CollectibleCategory | null
  productKeyAccessTokenCategory: ProductKeyAccessTokenCategory | null
  productKeyVirtualAssetCategory: ProductKeyVirtualAssetCategory | null
  isSensitiveContent: boolean | null
  ercType: ErcType | null
  descriptions: string[] | null
  images: string[] | null
}

export default IItem
