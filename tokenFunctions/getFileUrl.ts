import { create as ipfsHttpClient } from 'ipfs-http-client'

// @ts-ignore
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
//

/* Gets the ipfs url including the file data */
const getFileUrl = async (file: any) => {
  try {
    const added = await client.add(file, {
      progress: (prog) => console.log(`received: ${prog}`),
    })
    const url = `https://ipfs.infura.io/ipfs/${added.path}`
    return url
  } catch (e) {
    console.log(e)
  }
}

export default getFileUrl
