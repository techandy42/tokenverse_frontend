import { UserRole } from '../../enums/user'
import ICollection from '../schema/ICollection'
import INft from '../schema/INft'
import IReview from '../schema/IReview'

export default interface IUser {
  email: string
  address: string
  companyName: string
  createdAt: Date
  description: string
  facebookLink: string
  image: string | null
  instagramLink: string
  linkedInLink: string
  mainLink: string
  twitterLink: string
  userName: string
  verified: boolean
  verificationDate: Date
  role: UserRole
  likedNfts: number[]
  cartNfts: number[]
  collections?: ICollection[]
  nfts?: INft[]
  nftscreated?: INft[]
  reviews?: IReview[]
}
