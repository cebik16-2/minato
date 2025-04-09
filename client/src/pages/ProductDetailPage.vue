<template>
  <q-page class="q-pa-md">
    <q-inner-loading :showing="loading">
      <q-spinner-dots size="lg" color="primary" />
    </q-inner-loading>

    <div v-if="error" class="text-negative q-mt-md">
      {{ error }}
    </div>

    <div v-if="product && !loading">
      <div class="row q-col-gutter-md">
        <!-- Images Section -->
        <div class="col-12 col-md-6">
          <q-img
            :src="product.image_urls?.[0] || placeholderImage"
            spinner-color="primary"
            style="max-width: 100%; border-radius: 8px"
            :alt="product.title"
          />
          <div v-if="product.image_urls?.length > 1" class="q-mt-sm row q-col-gutter-xs">
            <div
              v-for="(url, index) in product.image_urls.slice(1)"
              :key="index"
              class="col-4"
            >
              <q-img
                :src="url"
                style="height: 100px; border-radius: 6px"
                spinner-color="primary"
              />
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="col-12 col-md-6">
          <h2 class="text-h5 q-mb-sm">{{ product.title || 'Untitled Product' }}</h2>
          <div class="text-subtitle1 text-grey-7 q-mb-md">
            {{ product.description || 'No description provided.' }}
          </div>
          <div class="text-h6 text-primary q-mb-md">
            €{{ product.price !== undefined ? product.price : 'N/A' }}
          </div>

          <div class="text-caption text-grey">
            Category: {{ product.category_name || 'Uncategorized' }}
          </div>
          <div class="text-caption text-grey q-mb-md">
            Seller: {{ product.seller?.email || 'Unknown' }}
          </div>

          <div class="q-mt-md">
            <q-btn
              color="primary"
              icon="shopping_cart"
              label="Add to Cart"
              @click="addToCart(product)"
            />
            <q-btn
              flat
              label="Back"
              icon="arrow_back"
              @click="$router.back()"
              class="q-ml-sm"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProduct } from 'src/services/api/products/products'
import type { Product } from 'src/types'

const route = useRoute()
const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const placeholderImage = 'https://via.placeholder.com/500x300?text=No+Image'

const addToCart = (item: Product) => {
  try {
    const raw = localStorage.getItem('cart') || '[]'
    const cart: Product[] = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : []
    cart.push(item)
    localStorage.setItem('cart', JSON.stringify(cart))
  } catch (err) {
    console.error('Failed to update cart:', err)
  }
}

onMounted(async () => {
  try {
    loading.value = true
    const productId = Number(route.params['id'])
    if (isNaN(productId)) throw new Error('Invalid product ID')

    const res = await getProduct(productId)
    product.value = res.data
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load product. Please try again later.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.text-subtitle1 {
  font-size: 1.1rem;
}
</style>
