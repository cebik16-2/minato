import { api } from '../../../boot/axios'

export const getFavorites = () => api.get('/favorites')
export const addFavorite = (favorite: object) => api.post('/favorites', { favorite })
export const removeFavorite = (id: number) => api.delete(`/favorites/${id}`)
