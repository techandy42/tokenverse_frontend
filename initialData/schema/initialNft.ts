import INft from '../../interfaces/schema/INft'
import {
  BlockchainType,
  SaleType,
  CollectibleCategory,
  ProductKeyAccessTokenCategory,
  ProductKeyVirtualAssetCategory,
  ErcType,
} from '../../enums/nftMetadata'

const initialNft: INft = {
  createdAt: new Date(0, 0, 0, 0, 0, 0),
  name: '',
  blockchainType: BlockchainType.POLYGON,
  fileUrl: null,
  multimediaFileUrl: null,
  price: 0,
  isOnSale: false,
  isOnLease: false,
  isOnAuction: false,
  isMetadataFrozen: false,
  isSensitiveContent: false,
  tokenId: 0,
  itemId: 0,
  startSaleDate: new Date(0, 0, 0, 0, 0, 0),
  endSaleDate: new Date(0, 0, 0, 0, 0, 0),
  saleType: SaleType.COLLECTIBLE,
  collectibleCategory: CollectibleCategory.MISCELLANEOUS,
  productKeyAccessTokenCategory: ProductKeyAccessTokenCategory.MISCELLANEOUS,
  productKeyVirtualAssetCategory: ProductKeyVirtualAssetCategory.MISCELLANEOUS,
  ercType: ErcType.ERC_721,
  likes: 0,
  descriptions: new Array(),
  propertiesKey: new Array(),
  propertiesValue: new Array(),
  imagesKey: new Array(),
  imagesValue: new Array(),
  levelsKey: new Array(),
  levelsValueNum: new Array(),
  levelsValueDen: new Array(),
}

export default initialNft
