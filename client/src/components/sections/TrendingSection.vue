<template>
  <section class="trending-section q-mt-xl">
    <div class="section-header row items-center justify-between q-mb-md">
      <div class="text-h6">🔥 Trending Items</div>

      <!-- Optional: View All / Filters -->
      <!--
      <q-btn flat label="View All" size="sm" color="primary" @click="goToAll" />
      -->
    </div>

    <ProductList
      :products="products"
      :favoritedIds="favoritedIds"
      @view-item="$emit('view-item', $event)"
      @toggle-favorite="$emit('toggle-favorite', $event)"
    />
  </section>
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

<style scoped>
.trending-section {
  padding: 0 12px;
}

.section-header {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 6px;
}
</style>
