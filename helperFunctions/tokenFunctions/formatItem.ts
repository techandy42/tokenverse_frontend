import IItem from '../../interfaces/IItem'

const formatItem = (i: any, meta: any, price: string, tokenURI: string) => {
  const item: IItem = {
    // token information
    itemId: i.itemId.toNumber(),
    tokenId: i.tokenId.toNumber(),
    nftContract: i.nftContract,
    creator: i.creator,
    seller: i.seller,
    owner: i.owner,
    price,
    isOnSale: i.isOnSale,
    isOnLease: i.isOnLease,
    isOnAuction: i.isOnAuction,
    collection: i.collection,
    startSaleDate: new Date(i.startSaleDate.toNumber()),
    endSaleDate: new Date(i.endSaleDate.toNumber()),
    tokenURI,
    // token metadata information
    name: meta.data.name,
    blockchainType: meta.data.blockchainType,
    // fileUrl --> image
    // multimedia --> animationUrl
    image: meta.data.image,
    animationUrl: meta.data.animationUrl,
    saleType: meta.data.saleType,
    collectibleCategory: meta.data.collectibleCategory,
    productKeyAccessTokenCategory: meta.data.productKeyAccessTokenCategory,
    productKeyVirtualAssetCategory: meta.data.productKeyVirtualAssetCategory,
    isSensitiveContent: meta.data.isSensitiveContent,
    ercType: meta.data.ercType,
    descriptions: meta.data.descriptions,
    // newly added fields
    images: meta.data.images,
    externalUrl: meta.data.externalUrl,
    youtubeUrl: meta.data.youtubeUrl,
    description: meta.data.description,
    attributes: JSON.parse(meta.data.attributes),
    //
  }
  return item
}

export default formatItem
