import ICollectionNFTs from '../../interfaces/ICollectionNFTs'
import IItem from '../../interfaces/IItem'

const groupNFTsIntoCollections = (items: IItem[]) => {
  const collectionNFTs: ICollectionNFTs = {}
  for (const item of items) {
    if (!collectionNFTs.hasOwnProperty(item.collection)) {
      collectionNFTs[item.collection] = [item]
    } else {
      collectionNFTs[item.collection] = [
        ...collectionNFTs[item.collection],
        item,
      ]
    }
  }
  return collectionNFTs
}

export default groupNFTsIntoCollections
