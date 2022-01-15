import IMultimedia from '../interfaces/IMultimedia'

const multimediaFileToMultimedia = (multimediaFile: File) => {
  const multimedia: IMultimedia = {
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
