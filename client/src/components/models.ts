// src/components/models.ts

export interface Todo {
  id: number
  title: string
  done: boolean
}

export interface Meta {
  totalCount: number
}

export interface EssentialLinkProps {
  title: string
  caption?: string
  link?: string
  icon?: string
}

export interface EssentialLink {
  title: string
  caption?: string
  link?: string
  icon?: string
}

export interface EssentialLinkGroup {
  title: string
  links: EssentialLink[]
}

export interface Product {
  id: number
  title: string // ← add this if it doesn't exist
  description?: string
  price?: number
  // Add more fields if needed, like: description, price, etc.
}
export interface Category {
  id: number
  name: string
  // Add more fields if needed, like: description, etc.
}
export interface ProductCategory {
  id: number
  productId: number
  categoryId: number
  // Add more fields if needed
}
export interface ProductCategoryWithProductAndCategory {
  id: number
  productId: number
  categoryId: number
  product: Product
  category: Category
  // Add more fields if needed
}
export interface ProductWithCategory {
  id: number
  name: string
  category: Category
  // Add more fields if needed, like: description, price, etc.
}
export interface CategoryWithProducts {
  id: number
  name: string
  products: Product[]
  // Add more fields if needed, like: description, etc.
}