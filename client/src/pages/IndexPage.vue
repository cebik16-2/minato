<template>
  <q-page class="q-pa-md">
    <LoginButton class="q-mb-lg" />

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
      <q-btn color="pink" label="🌟 Get Favorites" @click="fetchFavorites" />
      <q-btn color="accent" label="➕ Add Favorite" @click="addDummyFavorite" />
      <q-btn color="dark" label="🗑️ Remove First Favorite" @click="removeFirstFavorite" />
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
import { api } from '../boot/axios'
import {
  getFavorites,
  addFavorite,
  removeFavorite
} from '../services/api/favorites/favoritesApi'
import LoginButton from 'components/LoginButton.vue'
import ExampleComponent from 'components/ExampleComponent.vue'

const favorites = ref<{ id: number }[]>([])
const isAuthenticated = ref(false)
const todos = ref<Todo[]>([])
const meta = ref<Meta>({ totalCount: 0 })

const applyAuthHeaders = () => {
  const stored = localStorage.getItem('authToken')
  if (!stored) return

  try {
    const token = JSON.parse(stored)
    api.defaults.headers.common['access-token'] = token['access-token']
    api.defaults.headers.common['client'] = token['client']
    api.defaults.headers.common['uid'] = token['uid']
    isAuthenticated.value = true
  } catch (e) {
    console.warn('⚠️ Invalid auth token structure in localStorage', e)
  }
}

const fetchProducts = async () => {
  if (!isAuthenticated.value) return console.warn('⚠️ User not authenticated.')

  try {
    const response = await getUserProducts()
    const products: Product[] = response.data.products

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
      category_id: 1
    }
    const response = await createProduct(dummy)
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
    const response = await getProduct(productId)
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
    const response = await updateProduct(product.id, update)
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
    await deleteProduct(productId)
    console.log(`🗑️ Deleted product #${productId}`)
    await fetchProducts()
  } catch (err) {
    console.error(`❌ Failed to delete product #${productId}:`, err)
  }
}

const fetchFavorites = async () => {
  try {
    const response = await getFavorites()
    favorites.value = response.data
    console.log('🌟 Fetched Favorites:', favorites.value)
  } catch (err) {
    console.error('❌ Failed to fetch favorites:', err)
  }
}

const addDummyFavorite = async () => {
  const product = todos.value[0]
  if (!product) return console.warn('⚠️ No product available to favorite')

  try {
    const response = await addFavorite(product.id)
    console.log('✅ Added favorite:', response.data)
    await fetchFavorites()
  } catch (err) {
    console.error('❌ Failed to add favorite:', err)
  }
}

const removeFirstFavorite = async () => {
  const favorite = favorites.value[0]
  if (!favorite) return console.warn('⚠️ No favorites to remove')

  try {
    await removeFavorite(favorite.id)
    console.log(`🗑️ Removed favorite #${favorite.id}`)
    await fetchFavorites()
  } catch (err) {
    console.error(`❌ Failed to remove favorite #${favorite.id}:`, err)
  }
}

onMounted(() => {
  applyAuthHeaders()
  if (isAuthenticated.value) void fetchProducts()
  else console.warn('🔒 Not logged in. Please authenticate first.')
})
</script>
