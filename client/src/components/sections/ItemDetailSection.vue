<template>
  <div v-if="item" class="row q-col-gutter-md q-mt-lg">
    <!-- Image -->
    <div class="col-12 col-md-6">
      <q-img
        :src="item.thumbnail_url || placeholderImage"
        :alt="item.title || 'No title'"
        class="rounded-borders"
        style="max-height: 300px"
        spinner-color="primary"
      />
    </div>

    <!-- Info -->
    <div class="col-12 col-md-6">
      <div class="text-h5 text-bold">{{ item.title || 'Untitled Product' }}</div>
      <div class="text-subtitle1 text-primary q-mt-sm">
        € {{ item.price !== undefined ? item.price : 'N/A' }}
      </div>

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
  <div v-else class="text-center text-grey q-mt-md">
    Product not available.
  </div>
</template>

<script lang="ts" setup>
import type { Product } from 'src/types'
import { defineProps, defineEmits } from 'vue'

defineProps<{ item: Product | null }>()
defineEmits(['add-to-cart', 'back'])

const placeholderImage = 'https://via.placeholder.com/300x200?text=No+Image'
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
  object-fit: cover;
}
</style>
