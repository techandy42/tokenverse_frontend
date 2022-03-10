import React, { useState } from 'react'

interface ICollectionInfo {
  newName: string
  image: string | null
  description: string
}

const initialCollectionInfo: ICollectionInfo = {
  newName: '',
  image: null,
  description: '',
}

const edit = () => {
  const [collectionInfo, setCollectionInfo] = useState<ICollectionInfo>(
    initialCollectionInfo,
  )

  return <div>edit</div>
}

export default edit
