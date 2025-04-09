<template>
  <div>
    <div class="row q-col-gutter-md">
      <div
        v-for="product in products"
        :key="product.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <ItemCard :item="product" @view="emitView(product)" />
      </div>
    </div>

    <div v-if="!products.length" class="text-center q-mt-lg text-grey">
      No products found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import ItemCard from './ItemCard.vue'
import type { Product } from 'src/types'

defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{
  (e: 'view-item', item: Product): void
}>()

const emitView = (product: Product) => {
  emit('view-item', product)
}
</script>
