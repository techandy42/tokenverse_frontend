import { usersGetByUserName } from '../crudFunctions/users/usersRequests'

const doesUserNameExist = async (userName: string) => {
  // check if the userName is valid with the userNames in the database
  // the userName must be unique and not empty
  try {
    const user = await usersGetByUserName(userName)
    if (user.data === null) {
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

export default doesUserNameExist
