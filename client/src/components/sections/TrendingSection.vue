<template>
  <div class="q-mt-xl">
    <div class="text-h6 q-mb-md">Trending Items</div>
    <ProductList :products="products" @view-item="$emit('view-item', $event)" />
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
    }
  },
  emits: ['view-item']
})
</script>
