import IUser from '../schema/IUser'
import INft from '../schema/INft'

export default interface ICollectionRelation {
  image: string | null
  description: string
  createdAt: Date
  name: string
  isNameModified: boolean
  user?: IUser
  nfts?: INft[]
}
