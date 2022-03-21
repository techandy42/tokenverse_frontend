import {
  BlockchainType,
  SaleType,
  CollectibleCategory,
  ProductKeyAccessTokenCategory,
  ProductKeyVirtualAssetCategory,
  ErcType,
} from '../enums/nftMetadata'
import Attribute from '../types/Attribute'

/*
 * Note:
 * Must use snake casing for OpenSea to
 * recognize the fields in the metadata
 */

export default interface IData {
  image: string
  animation_url: string | null
  external_url: string
  youtube_url: string
  description: string
  name: string
  attributes: Attribute[]
}
