import IData from '../../interfaces/IData'
import Attribute from '../../types/Attribute'

const formatDataFields = (
  image: string,
  animation_url: string | null,
  external_url: string,
  youtube_url: string,
  description: string,
  name: string,
  attributes: Attribute[],
) => {
  const dataFields: IData = {
    image,
    animation_url,
    external_url,
    youtube_url,
    description,
    name,
    attributes,
  }
  return dataFields
}

export default formatDataFields
