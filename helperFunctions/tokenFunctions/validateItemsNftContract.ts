import emptyAddress from '../../constants/emptyAddress'

const validateItemsNftContract = (items: any[]) => {
  const validItems = []
  for (let i = 0; i < items.length; i++) {
    if (items[i].nftContract !== emptyAddress) {
      validItems.push(items[i])
    }
  }
  return validItems
}

export default validateItemsNftContract
