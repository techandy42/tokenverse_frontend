import INft from '../schema/INft'
import IUser from '../schema/IUser'

export default interface IReviewRelation {
  rating: number
  comment: string
  title: string
  nft?: INft
  user?: IUser
}
