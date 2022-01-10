const multimediaFileToMultimedia = (multimediaFile: File) => {
  const multimedia = {
    lastModified: multimediaFile.lastModified,
    lastModifiedDate: multimediaFile.lastModifiedDate,
    name: multimediaFile.name,
    size: multimediaFile.size,
    type: multimediaFile.type,
    webkitRelativePath: multimediaFile.webkitRelativePath,
  }
  return multimedia
}

export default multimediaFileToMultimedia
