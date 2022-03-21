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
    image: meta.data.image,
    animationUrl:
      meta.data.animationUrl !== undefined ? meta.data.animationUrl : null,
    externalUrl: meta.data.externalUrl,
    youtubeUrl: meta.data.youtubeUrl,
    description: meta.data.description,
    name: meta.data.name,
    attributes: meta.data.attributes,
    // back-end data, initially set as null
    blockchainType: null,
    saleType: null,
    collectibleCategory: null,
    productKeyAccessTokenCategory: null,
    productKeyVirtualAssetCategory: null,
    isSensitiveContent: null,
    ercType: null,
    descriptions: null,
    images: null,
  }
  return item
}

export default formatItem
