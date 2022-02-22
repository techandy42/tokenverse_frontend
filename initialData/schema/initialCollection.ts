import ICollection from '../../interfaces/schema/ICollection'

const initialCollection: ICollection = {
  image: null,
  description: '',
  createdAt: new Date(0, 0, 0, 0, 0, 0),
  name: '',
  isNameModified: false,
}

export default initialCollection
