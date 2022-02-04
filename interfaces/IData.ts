import {
  BlockchainType,
  SaleType,
  CollectibleCategory,
  ProductKeyRealLifeAssetCategory,
  ProductKeyVirtualAssetCategory,
  ErcType,
} from '../enums/nftMetadata'

export default interface IData {
  name: string
  collection: string
  blockchainType: BlockchainType
  fileUrl: string
  multimedia: any
  saleType: SaleType
  collectibleCategory: CollectibleCategory
  productKeyRealLifeAssetCategory: ProductKeyRealLifeAssetCategory
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
