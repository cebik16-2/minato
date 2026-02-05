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
          <q-carousel v-if="product.image_urls && product.image_urls.length > 0" v-model="slide" swipeable animated
            arrows navigation infinite control-color="white" prev-icon="arrow_back" next-icon="arrow_forward"
            height="400px" class="bg-grey-2 rounded-borders shadow-1">
            <q-carousel-slide v-for="(url, index) in product.image_urls" :key="index" :name="index" :img-src="url" />
          </q-carousel>

          <q-img v-else :src="placeholderImage" spinner-color="primary" style="max-width: 100%; border-radius: 8px"
            :alt="product.title" />
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

          <div class="text-caption text-grey q-mb-md">
            Category: {{ product.category_name || 'Uncategorized' }}
          </div>

          <q-card flat bordered class="bg-grey-1 q-pa-md q-mb-md">
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <div class="text-caption text-grey-7">MANUFACTURER</div>
                <div class="text-weight-bold">{{ product.manufacturer || '—' }}</div>
              </div>
              <div class="col-6">
                <div class="text-caption text-grey-7">MODEL</div>
                <div class="text-weight-bold">{{ product.model || '—' }}</div>
              </div>
              <div class="col-6">
                <div class="text-caption text-grey-7">YEAR</div>
                <div class="text-weight-bold">{{ product.year || '—' }}</div>
              </div>
              <div class="col-6">
                <div class="text-caption text-grey-7">CONDITION</div>
                <div class="text-weight-bold text-orange-9">{{ product.condition || '—' }}</div>
              </div>
            </div>
          </q-card>

          <div class="text-caption text-grey q-mb-md">
            Seller: {{ product.seller?.email || 'Unknown' }}
            <span v-if="product.seller?.username">({{ product.seller?.username }})</span>
          </div>

          <div class="q-mt-md">
            <q-btn color="primary" icon="shopping_cart" label="Add to Cart" @click="addToCart(product)" />
            <q-btn flat label="Back" icon="arrow_back" @click="$router.back()" class="q-ml-sm" />
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
const slide = ref(0)
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
    product.value = res.data.product || res.data
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
