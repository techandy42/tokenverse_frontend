/* CRUD request functions to the back-end for collections route */

import axios from 'axios'
import { urlCollections } from '../crudUrls'

export interface INewCollectionInfo {
  newName: string
  image: string | null
  description: string
  isSameName: boolean
}

export const collectionsPost = (address: string) =>
  axios.post(`${urlCollections}/${address}`)
export const collectionsGet = (name: string) =>
  axios.get(`${urlCollections}/${name}`)
export const collectionsChangeInfoPut = (
  name: string,
  newCollectionInfo: INewCollectionInfo,
) => axios.put(`${urlCollections}/change-info/${name}`, newCollectionInfo)
export const colectionsDelete = (name: string) =>
  axios.delete(`${urlCollections}/${name}`)
export const collectionsGetAll = () => axios.get(urlCollections)
