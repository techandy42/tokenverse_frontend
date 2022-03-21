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
  // fileUrl --> image
  // multimediaFileUrl --> animationUrl
  image: null,
  animationUrl: null,
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
  // newly added fields
  images: new Array(),
  externalUrl: '',
  youtubeUrl: '',
  description: '',
  attributes: new Array(),
  //
}

export default initialNft
