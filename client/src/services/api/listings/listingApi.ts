import { api } from '../../../boot/axios'

export const getListings = () => api.get('/api/listings')
export const getListingById = (id: number) => api.get(`/api/listings/${id}`)
