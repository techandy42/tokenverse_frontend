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
    // do combination
    const combinationMap = new Map(
      [...userCreatedItems, ...userOwnedItems].map((item) => [
        item.tokenId,
        item,
      ]),
    ) // map of unique items in [tokenId, item] format
    const combination = Array.from(combinationMap)
    return combination
  }
}

export default filterDuplicateItems
