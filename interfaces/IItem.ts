import {
  BlockchainType,
  ErcType,
  SaleType,
  CollectibleCategory,
  ProductKeyAccessTokenCategory,
  ProductKeyVirtualAssetCategory,
} from '../enums/nftMetadata'

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
  fileUrl: string
  multimedia: string | null
  saleType: SaleType
  collectibleCategory: CollectibleCategory
  productKeyAccessTokenCategory: ProductKeyAccessTokenCategory
  productKeyVirtualAssetCategory: ProductKeyVirtualAssetCategory
  isSensitiveContent: boolean
  ercType: ErcType
  descriptions: string[]
  propertiesKey: string[]
  propertiesValue: string[]
  imagesKey: string[]
  imagesValue: string[]
  levelsKey: string[]
  levelsValueNum: number[]
  levelsValueDen: number[]
}

export default IItem
