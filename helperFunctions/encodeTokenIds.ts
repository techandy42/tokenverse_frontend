const encodeTokenIds = (tokenIds: number[]) => {
  let encodedString = ''
  for (const tokenId of tokenIds) {
    encodedString += `id=${tokenId}&`
  }
  encodedString = encodedString.slice(0, encodedString.length - 1)
  return encodedString
}

export default encodeTokenIds
