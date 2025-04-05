import { api } from '../../../boot/axios'

export const getListings = () => api.get('/listings')
export const getListingById = (id: number) => api.get(`/listings/${id}`)
