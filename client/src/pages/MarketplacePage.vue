<template>
  <q-page class="q-pa-md">
    <!-- Banner Carousel -->
    <BannerCarousel :slides="slides" />

    <!-- Product List -->
    <q-infinite-scroll
      @load="loadMore"
      :offset="100"
      ref="infiniteScroll"
      :disable="!hasMore"
    >
      <ProductList
        :products="products"
        :favoritedIds="favoritedProductIds"
        @view-item="viewItem"
        @toggle-favorite="toggleFavorite"
      />

      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots size="lg" color="primary" />
        </div>
      </template>
    </q-infinite-scroll>

    <!-- Quick View Modal -->
    <QuickViewModal
      v-model="quickViewVisible"
      :item="selectedItem"
      @close="quickViewVisible = false"
      @add-to-cart="addToCart"
    />

    <!-- Add Item Modal -->
    <AddItemModal
      v-if="showAddItem"
      @item-added="handleItemAdded"
      @close="showAddItem = false"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BannerCarousel from 'src/components/sections/BannerCarousel.vue'
import ProductList from 'src/components/sections/ProductList.vue'
import QuickViewModal from 'src/components/modals/QuickViewModal.vue'
import AddItemModal from 'src/components/modals/AddItemModal.vue'
import { fetchProducts } from 'src/services/api/products/products'
import { getFavorites, addFavorite, removeFavorite } from '../services/api/favorites/favoritesApi'
import type { Product } from 'src/types'
import banner1 from 'src/assets/banners/banner-1.webp'
import banner2 from 'src/assets/banners/banner-2.webp'
import banner3 from 'src/assets/banners/banner-3.webp'

interface Favorite {
  id: number
  product_id: number
}

interface Slide {
  image: string
}

const slides: Slide[] = [
  { image: banner1 },
  { image: banner2 },
  { image: banner3 }
]

const products = ref<Product[]>([])
const page = ref(1)
const hasMore = ref(true)

const selectedItem = ref<Product | null>(null)
const quickViewVisible = ref(false)
const showAddItem = ref(false)

const favoritedProductIds = ref<number[]>([])
const favoriteMap = ref<Record<number, number>>({})

// 🧠 Load and group favorites
const loadFavorites = async () => {
  try {
    const res = await getFavorites()
    console.log('📦 Raw getFavorites response:', res.data)

    // Safe fallback: check if response is an array or contains one
    const rawFavorites: Favorite[] = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.favorites)
        ? res.data.favorites
        : []

    favoritedProductIds.value = rawFavorites.map((fav) => fav.product_id)

    favoriteMap.value = rawFavorites.reduce((acc: Record<number, number>, fav) => {
      acc[fav.product_id] = fav.id
      return acc
    }, {})

  } catch (err) {
    console.error('❌ Error loading favorites:', err)
    favoritedProductIds.value = []
    favoriteMap.value = {}
  }
}

// ❤️ Toggle favorite
const toggleFavorite = async (product: Product) => {
  const isFav = favoritedProductIds.value.includes(product.id)

  try {
    if (isFav) {
      const favoriteId = favoriteMap.value[product.id]
      if (favoriteId !== undefined) {
        await removeFavorite(favoriteId)
        favoritedProductIds.value = favoritedProductIds.value.filter(id => id !== product.id)
        delete favoriteMap.value[product.id]
      }
    } else {
      const res = await addFavorite(product.id)
      favoritedProductIds.value.push(product.id)
      favoriteMap.value[product.id] = res.data.id
    }
  } catch (err) {
    console.error('Failed to toggle favorite:', err)
  }
}

// 🛒 Cart logic
const addToCart = (item: Product) => {
  const cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]')
  cart.push(item)
  localStorage.setItem('cart', JSON.stringify(cart))
}

// ➕ Add item from modal
const handleItemAdded = (newItem: Product) => {
  products.value.unshift(newItem)
  showAddItem.value = false
}

// 👁️ View product (opens modal)
const viewItem = (item: Product) => {
  selectedItem.value = item
  quickViewVisible.value = true
}

// ⬇️ Infinite Scroll Loader
const loadMore = async (_index: number, done: (stop?: boolean) => void) => {
  try {
    const res = await fetchProducts(page.value)
    
    // Handle response structure: API returns {data: {products: [], meta: {}}}
    const productsData = res.data?.products || []
    const meta = res.data?.meta

    if (!meta?.next_page || productsData.length === 0) {
      hasMore.value = false
      done(true)
      return
    }

    products.value.push(...productsData)
    page.value++
  } catch (error) {
    console.error('Error loading products:', error)
    hasMore.value = false
    done(true)
    return
  }

  done()
}

// 📦 On Page Load
onMounted(() => {
  void loadFavorites()
})
</script>
