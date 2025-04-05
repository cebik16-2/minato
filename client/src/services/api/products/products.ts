import { api } from '../../../boot/axios'

export const getAllProducts = () => api.get('/products')
export const getUserProducts = (userId: string | number) =>
  api.get(`/users/${userId}/products`)

export const createProduct = (userId: string | number, product: object) =>
  api.post(`/users/${userId}/products`, { product })

export const getProduct = (userId: number, id: number) =>
  api.get(`/users/${userId}/products/${id}`)

export const updateProduct = (userId: number, id: number, product: object) =>
  api.put(`/users/${userId}/products/${id}`, { product })

export const deleteProduct = (userId: number, id: number) =>
  api.delete(`/users/${userId}/products/${id}`)
