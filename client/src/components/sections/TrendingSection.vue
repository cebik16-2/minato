<template>
  <div class="q-mt-xl">
    <div class="text-h6 q-mb-md">Trending Items</div>
    <ProductList
      :products="products"
      :favoritedIds="favoritedIds"
      @view-item="$emit('view-item', $event)"
      @toggle-favorite="$emit('toggle-favorite', $event)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { Product } from 'src/types'
import ProductList from './ProductList.vue'

export default defineComponent({
  name: 'TrendingSection',
  components: { ProductList },
  props: {
    products: {
      type: Array as PropType<Product[]>,
      required: true
    },
    favoritedIds: {
      type: Array as PropType<number[]>,
      required: true
    }
  },
  emits: ['view-item', 'toggle-favorite']
})
</script>
