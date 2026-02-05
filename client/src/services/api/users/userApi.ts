import { api } from '../../../boot/axios'

export const getUsers = () => api.get('/api/users')
export const getUserById = (id: number | string) => api.get(`/api/users/${id}`)
export const getCurrentUser = () => api.get('/api/users/current')
export const updateCurrentUser = (userData: { username?: string; email?: string }) =>
  api.put('/api/users/current', userData)
