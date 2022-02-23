import {
  BlockchainType,
  ErcType,
  SaleType,
  CollectibleCategory,
  ProductKeyAccessTokenCategory,
  ProductKeyVirtualAssetCategory,
} from '../../enums/nftMetadata'
import IData from '../../interfaces/IData'

const formatDataFields = (
  name: string,
  collection: string,
  blockchainType: BlockchainType,
  ercType: ErcType,
  fileUrl: string,
  multimedia: string | null,
) => {
  const dataFields: IData = {
    name,
    collection,
    blockchainType,
    ercType,
    fileUrl,
    multimedia,
    saleType: SaleType.COLLECTIBLE,
    collectibleCategory: CollectibleCategory.MISCELLANEOUS,
    productKeyAccessTokenCategory: ProductKeyAccessTokenCategory.MISCELLANEOUS,
    productKeyVirtualAssetCategory:
      ProductKeyVirtualAssetCategory.MISCELLANEOUS,
    isSensitiveContent: false,
    descriptions: new Array(),
    propertiesKey: new Array(),
    propertiesValue: new Array(),
    imagesKey: new Array(),
    imagesValue: new Array(),
    levelsKey: new Array(),
    levelsValueNum: new Array(),
    levelsValueDen: new Array(),
  }
  return dataFields
}

export default formatDataFields
