/* CRUD request functions to the back-end for users route */

import axios from 'axios'
import { urlUsers } from '../crudUrls'

interface IUserInfo {
  address: string
}
interface IUserLikedCartInfo {
  tokenId: number
}
interface IUserNewInfo {
  image: JSON | null
  userName: string
  companyName: string
  description: string
  email: string
  mainLink: string
  facebookLink: string
  instagramLink: string
  twitterLink: string
  linkedInLink: string
}

export const usersPost = (userInfo: IUserInfo) => axios.post(urlUsers, userInfo)
export const usersGet = (address: string) => axios.get(`${urlUsers}/${address}`)
export const usersLikedGet = (address: string) =>
  axios.get(`${urlUsers}/liked/${address}`)
export const usersCartGet = (address: string) =>
  axios.get(`${urlUsers}/cart/${address}`)
export const usersLikedPut = (
  address: string,
  userLikedInfo: IUserLikedCartInfo,
) => axios.put(`${urlUsers}/liked/${address}`, userLikedInfo)
export const usersCartPut = (
  address: string,
  userCartInfo: IUserLikedCartInfo,
) => axios.put(`${urlUsers}/cart/${address}`, userCartInfo)
export const usersPut = (address: string, userNewInfo: IUserNewInfo) =>
  axios.put(`${urlUsers}/${address}`, userNewInfo)
