import { api } from 'src/boot/axios'
import type { Product } from 'src/types'

// 🔢 Pagination metadata type
interface PaginationMeta {
  current_page: number
  next_page: number | null
  prev_page: number | null
  total_pages: number
  total_count: number
}

// 🆕 Paginated fetch for marketplace
export const fetchProducts = async (
  page = 1,
  perPage = 20
): Promise<{ data: { products: Product[]; meta: PaginationMeta } }> => {
  const response = await api.get('/api/products', {
    params: { page, per_page: perPage }
  })

  return response
}

// 🧾 Get all products (unpaginated – fallback or admin use)
export const getAllProducts = () => api.get('/api/products')

// 👤 Get products of the currently logged-in user
export const getUserProducts = () => api.get('/api/products/my_products')

// ➕ Create a product for the current user
export const createProduct = (product: object) =>
  api.post('/api/products', { product })

// 🔍 Get a specific product by ID
export const getProduct = (id: number) => api.get(`/api/products/${id}`)

// 🔁 Update a user's product
export const updateProduct = (id: number, product: object) =>
  api.put(`/api/products/${id}`, { product })

// ❌ Delete a product by ID
export const deleteProduct = (id: number) => api.delete(`/api/products/${id}`)
