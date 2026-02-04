import { api } from '../../../boot/axios'

export const getFavorites = () => api.get('/api/favorites')

export const addFavorite = (productId: number) =>
  api.post('/api/favorites', { product_id: productId })

export const removeFavorite = (favoriteId: number) =>
  api.delete(`/api/favorites/${favoriteId}`)
