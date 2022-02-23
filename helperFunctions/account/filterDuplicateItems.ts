import IItem from '../../interfaces/IItem'

const filterDuplicateItems = (
  userCreatedItems: IItem[] | null,
  userOwnedItems: IItem[] | null,
) => {
  if (userCreatedItems === null && userOwnedItems === null) {
    return null
  } else if (userCreatedItems === null) {
    return userOwnedItems
  } else if (userOwnedItems === null) {
    return userCreatedItems
  } else {
    const joinedItems = [...userCreatedItems, ...userOwnedItems]
    const setItems = new Set(joinedItems)
    const filteredItems = Array.from(setItems)
    return filteredItems
  }
}

export default filterDuplicateItems
