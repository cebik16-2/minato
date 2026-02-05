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
  categoryId?: number,
  perPage = 20,
  filters?: {
    min_price?: number
    max_price?: number
    city?: string
    manufacturer?: string
    model?: string
    condition?: string
    min_year?: number
    max_year?: number
  }
): Promise<{ data: { products: Product[]; meta: PaginationMeta } }> => {
  const params: any = { page, per_page: perPage, category_id: categoryId }

  if (filters?.min_price) params.min_price = filters.min_price
  if (filters?.max_price) params.max_price = filters.max_price
  if (filters?.city) params.city = filters.city
  if (filters?.manufacturer) params.manufacturer = filters.manufacturer
  if (filters?.model) params.model = filters.model
  if (filters?.condition) params.condition = filters.condition
  if (filters?.min_year) params.min_year = filters.min_year
  if (filters?.max_year) params.max_year = filters.max_year

  const response = await api.get('/api/products', { params })

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


