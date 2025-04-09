import { api } from '../../../boot/axios'

export const getFavorites = () => api.get('/favorites')

export const addFavorite = (productId: number) =>
  api.post('/favorites', { product_id: productId })

export const removeFavorite = (favoriteId: number) =>
  api.delete(`/favorites/${favoriteId}`)
