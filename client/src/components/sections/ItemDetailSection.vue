<template>
  <div v-if="item" class="q-mt-xl q-pa-md row q-col-gutter-xl">
    <!-- Product Image -->
    <div class="col-12 col-md-6">
      <q-img
        :src="item.thumbnail_url || placeholderImage"
        :alt="item.title || 'Product image'"
        class="product-image"
        spinner-color="primary"
        transition="fade"
      />
    </div>

    <!-- Product Details -->
    <div class="col-12 col-md-6 column justify-between q-gutter-sm">
      <div>
        <h2 class="text-h5 text-bold text-dark">{{ item.title || 'Untitled Product' }}</h2>
        <p class="text-subtitle1 text-primary q-mt-xs">
          € {{ item.price !== undefined ? item.price.toFixed(2) : 'N/A' }}
        </p>

        <q-separator class="q-my-md" />

        <p class="text-body1 text-grey-8">
          {{ item.description || 'No description available for this product.' }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="q-mt-md">
        <q-btn
          color="primary"
          icon="shopping_cart"
          label="Add to Cart"
          class="q-mr-sm"
          @click="$emit('add-to-cart', item)"
        />
        <q-btn
          flat
          icon="arrow_back"
          label="Back"
          @click="$emit('back')"
        />
      </div>
    </div>
  </div>

  <!-- Fallback State -->
  <div v-else class="text-center text-grey q-my-xl">
    <q-icon name="warning" size="md" class="q-mb-sm" />
    <div class="text-subtitle2">Product not available.</div>
  </div>
</template>

<script lang="ts" setup>
import type { Product } from 'src/types'

defineProps<{ item: Product | null }>()
defineEmits(['add-to-cart', 'back'])

const placeholderImage = 'https://via.placeholder.com/600x400?text=No+Image'
</script>

<style scoped>
.product-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 16px;
}
</style>
