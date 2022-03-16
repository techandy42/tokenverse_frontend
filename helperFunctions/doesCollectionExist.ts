import { collectionsGet } from '../crudFunctions/collections/collectionsRequests'

const doesCollectionExist = async (userName: string) => {
  // check if the userName is valid with the userNames in the database
  // the userName must be unique and not empty
  try {
    const collection = await collectionsGet(userName)
    if (collection.data === null) {
      // user doesn't exist
      return false
    } else {
      return true
    }
  } catch (error) {
    console.log(error)
    return true
  }
}

export default doesCollectionExist
