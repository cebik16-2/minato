import { api } from '../../../boot/axios'

export const getCategories = () => api.get('/api/categories')
