<template>
  <q-page>
    <!-- 1. Industrial Banner -->
    <IndustrialBanner />

    <!-- 2. Sticker Search Bar -->
    <q-page-sticky position="top" expand class="z-top" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
      style="top: 50px" v-if="stickySearch">
      <SearchToolbar @search="handleSearch" />
    </q-page-sticky>
    <div id="search-anchor">
      <SearchToolbar @search="handleSearch" />
    </div>

    <!-- 3. Product Feed -->
    <div class="q-pa-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-1'" style="min-height: 800px">
      <div class="text-h5 font-mono text-weight-bold q-mb-md q-ml-sm text-grey-9">
        LATEST ARRIVALS_
      </div>

      <q-infinite-scroll @load="loadMore" :offset="250" ref="infiniteScrollRef" :disable="!hasMore">
        <VintageProductList :products="products" :favoritedIds="favoritedProductIds" @view-item="viewItem"
          @toggle-favorite="toggleFavorite" />

        <template v-slot:loading>
          <div class="row justify-center q-my-xl">
            <q-spinner-dots size="40px" color="orange-9" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>

    <!-- Quick View Overlay -->
    <QuickViewModal v-model="quickViewVisible" :item="selectedItem" @close="quickViewVisible = false"
      @add-to-cart="addToCart" />

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import IndustrialBanner from 'src/components/sections/IndustrialBanner.vue'
import SearchToolbar from 'src/components/sections/SearchToolbar.vue'
import VintageProductList from 'src/components/sections/VintageProductList.vue'
import QuickViewModal from 'src/components/modals/QuickViewModal.vue'

import { fetchProducts } from 'src/services/api/products/products'
import { getFavorites, addFavorite, removeFavorite } from 'src/services/api/favorites/favoritesApi'
import type { Product } from 'src/types'

// State
const products = ref<Product[]>([])
const page = ref(1)
const hasMore = ref(true)
const stickySearch = ref(false)

const quickViewVisible = ref(false)
const selectedItem = ref<Product | null>(null)
const favoritedProductIds = ref<number[]>([])
const favoriteMap = ref<Record<number, number>>({})

// Filter State
const searchFilters = ref<{
  categoryId?: number | null,
  min_price?: number,
  max_price?: number,
  city?: string,
  manufacturer?: string,
  model?: string,
  condition?: string,
  min_year?: number,
  max_year?: number
} | undefined>(undefined)

// Infinite Scroll
const loadMore = async (_index: number, done: (stop?: boolean) => void) => {
  try {
    const res = await fetchProducts(page.value, searchFilters.value?.categoryId || undefined, 8, searchFilters.value)
    const newProducts = res.data?.products || []
    const meta = res.data?.meta

    if (page.value === 1) {
      products.value = newProducts
    } else {
      products.value.push(...newProducts)
    }

    if (!meta?.next_page || newProducts.length === 0) {
      hasMore.value = false
      done(true)
      return
    }

    page.value++
    done()
  } catch (err) {
    console.error('Failed to load products', err)
    hasMore.value = false
    done(true)
  }
}

interface Favorite {
  id: number
  product_id: number
}

// Favorites Logic
const loadFavorites = async () => {
  try {
    const res = await getFavorites()
    const rawFavs = (Array.isArray(res.data) ? res.data : (res.data?.favorites || [])) as Favorite[]

    favoritedProductIds.value = rawFavs.map(f => f.product_id)
    favoriteMap.value = rawFavs.reduce((acc: Record<number, number>, f) => ({ ...acc, [f.product_id]: f.id }), {})
  } catch (err) {
    console.warn('Failed to load favorites', err)
  }
}

const toggleFavorite = async (product: Product) => {
  const isFav = favoritedProductIds.value.includes(product.id)
  try {
    if (isFav) {
      const favId = favoriteMap.value[product.id]
      if (favId) {
        await removeFavorite(favId)
        favoritedProductIds.value = favoritedProductIds.value.filter(id => id !== product.id)
        delete favoriteMap.value[product.id]
      }
    } else {
      const res = await addFavorite(product.id)
      favoritedProductIds.value.push(product.id)
      favoriteMap.value[product.id] = res.data.id
    }
  } catch (err) {
    console.error('Toggle favorite failed', err)
  }
}

const handleSearch = (filters: any) => {
  console.log('LandingPage: Search triggered with:', filters)
  console.log('LandingPage: Category ID:', filters.categoryId)

  // Map toolbar filters to API parameters

  // 1. Manufacturer (Make)
  const manufacturer = filters.make || undefined

  // 2. Year Range Parsing
  let min_year, max_year
  if (filters.yearRange) {
    if (filters.yearRange.includes('+')) {
      min_year = parseInt(filters.yearRange.replace('+', ''))
    } else if (filters.yearRange.includes('Pre-')) {
      max_year = parseInt(filters.yearRange.replace('Pre-', ''))
    } else {
      const parts = filters.yearRange.split('-')
      if (parts.length === 2) {
        min_year = parseInt(parts[0])
        max_year = parseInt(parts[1])
      }
    }
  }

  // 3. Condition
  const condition = filters.condition || undefined

  // 4. Price Parsing
  let min_price, max_price
  if (filters.price) {
    // Expected formats: "Under $10k", "$10k - $25k", "$50k+"
    const cleanPrice = (str: string) => parseInt(str.replace(/[^0-9]/g, '')) * (str.includes('k') ? 1000 : 1)

    if (filters.price.includes('Under')) {
      max_price = cleanPrice(filters.price)
    } else if (filters.price.includes('+')) {
      min_price = cleanPrice(filters.price)
    } else {
      const parts = filters.price.split('-')
      if (parts.length === 2) {
        min_price = cleanPrice(parts[0])
        max_price = cleanPrice(parts[1])
      }
    }
  }

  searchFilters.value = {
    categoryId: filters.categoryId,
    manufacturer,
    condition,
    min_year,
    max_year,
    min_price,
    max_price
  }

  // Reset list
  page.value = 1
  products.value = []
  hasMore.value = true

  // Trigger load
  // We can't easily trigger infinite scroll manually, so we just reset and let the user scroll 
  // OR we manually fetch the first page
  void loadMore(0, () => { })
}

// Product Navigation
import { useRouter } from 'vue-router'
const router = useRouter()

const viewItem = (item: Product) => {
  void router.push({ name: 'product-detail', params: { id: item.id } })
}

const addToCart = (item: Product) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  cart.push(item)
  localStorage.setItem('cart', JSON.stringify(cart))
}

// Scroll observer for sticky header (optional enhancement)
onMounted(() => {
  void loadFavorites()
  // Trigger initial load
  void loadMore(1, () => { })
})
</script>

<style scoped>
.font-mono {
  font-family: 'Roboto Mono', monospace;
}
</style>
