import { api } from '../../../boot/axios'

export const getCities = () => api.get('/api/cities')
