import { api } from '../../../boot/axios'

// 🆗 Get all products (not user-specific)
export const getAllProducts = () => api.get('/products')

// ✅ Get products of the currently logged-in user
export const getUserProducts = () => api.get('/products')

// ✅ Create product for current user
export const createProduct = (product: object) =>
  api.post('/products', { product })

// ✅ Get a specific product (you can secure this in the controller)
export const getProduct = (id: number) =>
  api.get(`/products/${id}`)

// ✅ Update a product belonging to the user
export const updateProduct = (id: number, product: object) =>
  api.put(`/products/${id}`, { product })

// ✅ Delete a product
export const deleteProduct = (id: number) =>
  api.delete(`/products/${id}`)
