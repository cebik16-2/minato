<template>
  <q-page class="q-pa-md">
    <example-component
      v-if="todos.length"
      title="Fetched Products"
      active
      :todos="todos"
      :meta="meta"
    />
    <div v-else class="q-gutter-md q-mt-xl flex flex-center column">
      <q-spinner size="50px" color="primary" />
      <div class="text-subtitle1 q-mt-sm">Loading products...</div>
    </div>

    <div class="q-mt-lg q-gutter-sm">
      <q-btn color="primary" label="🔄 Refresh" @click="fetchProducts" />
      <q-btn color="positive" label="➕ Create" @click="createDummyProduct" />
      <q-btn color="info" label="📦 Get First Product" @click="getSingleProduct" />
      <q-btn color="warning" label="✏️ Update First Product" @click="updateProductData" />
      <q-btn color="negative" label="❌ Delete First Product" @click="deleteProductEntry" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Todo, Meta, Product } from '@/components/models'
import {
  getUserProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct
} from '../services/api/products/products'
import ExampleComponent from 'components/ExampleComponent.vue'
import { api } from '../boot/axios'

// Hardcoded userId for now
const userId = 1

const isAuthenticated = ref(false)
const todos = ref<Todo[]>([])
const meta = ref<Meta>({ totalCount: 0 })

const fetchProducts = async () => {
  if (!isAuthenticated.value) {
    console.warn('⚠️ User not authenticated.')
    return
  }

  try {
    const response = await getUserProducts(userId)
    const products: Product[] = response.data.products
    console.log('📦 Fetched Products:', products)

    if (Array.isArray(products)) {
      todos.value = products.map((product) => ({
        id: product.id,
        title: product.title || `Product #${product.id}`,
        done: false
      }))
      meta.value.totalCount = products.length
    } else {
      console.warn('🚨 Expected array, got:', typeof products, products)
    }
  } catch (err) {
    console.error('❌ Failed to fetch products:', err)
  }
}

const createDummyProduct = async () => {
  try {
    const dummy = {
      title: 'Test Product',
      description: 'Created from frontend',
      price: 9.99,
      category_id: 1 // ✅ Must exist in your DB!
    }
    const response = await createProduct(userId, dummy)
    console.log('✅ Created product:', response.data)
    await fetchProducts()
  } catch (err) {
    console.error('❌ Failed to create product:', err)
  }
}

const getSingleProduct = async () => {
  const productId = todos.value[0]?.id
  if (!productId) return console.warn("⚠️ No products to fetch")

  try {
    const response = await getProduct(userId, productId)
    console.log(`📦 Product #${productId}:`, response.data)
  } catch (err) {
    console.error(`❌ Failed to get product #${productId}:`, err)
  }
}

const updateProductData = async () => {
  const product = todos.value[0]
  if (!product) return console.warn('⚠️ No product available to update')

  try {
    const update = {
      title: 'Updated Title 🎯',
      price: 100.0,
      category_id: 1
    }
    const response = await updateProduct(userId, product.id, update)
    console.log(`✏️ Updated product #${product.id}:`, response.data)
    await fetchProducts()
  } catch (err) {
    console.error(`❌ Failed to update product #${product.id}:`, err)
  }
}

const deleteProductEntry = async () => {
  const productId = todos.value[0]?.id
  if (!productId) return console.warn("⚠️ No product to delete")

  try {
    await deleteProduct(userId, productId)
    console.log(`🗑️ Deleted product #${productId}`)
    await fetchProducts()
  } catch (err) {
    console.error(`❌ Failed to delete product #${productId}:`, err)
  }
}

onMounted(() => {
  const token = localStorage.getItem('authToken')
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    isAuthenticated.value = true
    fetchProducts()
  } else {
    console.warn('🔒 Not logged in. Please authenticate first.')
  }
})
</script>
