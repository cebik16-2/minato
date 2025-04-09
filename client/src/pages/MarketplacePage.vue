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

interface Favorite {
  id: number
  product_id: number
}

const slides = [
  '/assets/banner1.jpg',
  '/assets/banner2.jpg',
  '/assets/banner3.jpg'
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
    const favorites = res.data as Favorite[]

    favoritedProductIds.value = favorites.map(fav => fav.product_id)
    favoriteMap.value = favorites.reduce((acc: Record<number, number>, fav) => {
      acc[fav.product_id] = fav.id
      return acc
    }, {})
  } catch (err) {
    console.error('Error loading favorites:', err)
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

    if (!res.meta?.next_page || res.data.length === 0) {
      hasMore.value = false
      done(true)
      return
    }

    products.value.push(...res.data)
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
