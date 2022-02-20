/* CRUD request functions to the back-end for reviews route */

import axios from 'axios'
import { urlReviews } from '../crudUrls'

export interface IReviewInfo {
  address: string
  tokenId: number
  rating: number
  comment: string
}

export interface IReviewNewInfo {
  rating: number
  comment: string
}

export const reviewsGet = (id: number) => axios.get(`${urlReviews}/${id}`)
export const reviewsPost = (reviewInfo: IReviewInfo) =>
  axios.post(urlReviews, reviewInfo)
export const reviewsPut = (id: number, reviewNewInfo: IReviewNewInfo) =>
  axios.put(`${urlReviews}/${id}`, reviewNewInfo)
export const reviewsDelete = (id: number) => axios.delete(`${urlReviews}/${id}`)
