import {
  BlockchainType,
  SaleType,
  CollectibleCategory,
  ProductKeyAccessTokenCategory,
  ProductKeyVirtualAssetCategory,
  ErcType,
} from '../enums/nftMetadata'

export default interface IData {
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
