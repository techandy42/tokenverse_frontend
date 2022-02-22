import { UserRole } from '../../enums/user'
import emptyAddress from '../../constants/emptyAddress'
import IUser from '../../interfaces/schema/IUser'

const initialUser: IUser = {
  email: '',
  address: emptyAddress,
  companyName: '',
  createdAt: new Date(0, 0, 0, 0, 0, 0),
  description: '',
  facebookLink: '',
  image: null,
  instagramLink: '',
  linkedInLink: '',
  mainLink: '',
  twitterLink: '',
  userName: '',
  verified: false,
  verificationDate: new Date(0, 0, 0, 0, 0, 0),
  role: UserRole.USER,
  likedNfts: new Array(),
  cartNfts: new Array(),
}

export default initialUser
