<template>
  <q-page class="q-pa-md">
    <!-- Banner Carousel -->
    <BannerCarousel :slides="slides" />

    <!-- Product List (with Infinite Scroll) -->
    <q-infinite-scroll
      @load="loadMore"
      :offset="100"
      ref="infiniteScroll"
      :disable="!hasMore"
    >
      <ProductList :products="products" @view-item="viewItem" />

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
import { ref } from 'vue'
import BannerCarousel from 'src/components/sections/BannerCarousel.vue'
import ProductList from 'src/components/sections/ProductList.vue'
import QuickViewModal from 'src/components/modals/QuickViewModal.vue'
import AddItemModal from 'src/components/modals/AddItemModal.vue'
import { fetchProducts } from 'src/services/api/products/products'
import type { Product } from 'src/types'

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

const viewItem = (item: Product) => {
  selectedItem.value = item
  quickViewVisible.value = true
}

const addToCart = (item: Product) => {
  const cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]')
  cart.push(item)
  localStorage.setItem('cart', JSON.stringify(cart))
}

const handleItemAdded = (newItem: Product) => {
  products.value.unshift(newItem)
  showAddItem.value = false
}

const loadMore = async (_index: number, done: (stop?: boolean) => void) => {
  try {
    const res = await fetchProducts(page.value)

    if (!res.meta.next_page || res.data.length === 0) {
      hasMore.value = false
      done(true) // stop scrolling
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
</script>
