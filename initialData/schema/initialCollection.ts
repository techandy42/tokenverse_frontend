import ICollection from '../../interfaces/schema/ICollection'
import emptyUuid from '../../constants/emptyUuid'

const initialCollection: ICollection = {
  uuid: emptyUuid,
  image: null,
  description: '',
  createdAt: new Date(0, 0, 0, 0, 0, 0),
  name: '',
  isNameModified: false,
}

export default initialCollection
