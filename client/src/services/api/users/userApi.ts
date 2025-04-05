import { api } from '../../../boot/axios'

export const getUsers = () => api.get('/users')
export const getUserById = (id: number | string) => api.get(`/users/${id}`)
