export default interface IToken {
  tokenUri: string
  itemId: number
  tokenId: number
  creator: string
  seller: string
  owner: string
  price: number
  onSale: boolean
  frozen: boolean
  name: string
  collection: string
  blockchainType: string
  image: string
  multimedia: string | null
}
