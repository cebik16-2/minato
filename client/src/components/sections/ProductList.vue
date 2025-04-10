<template>
  <div class="product-list">
    <div v-if="products.length" class="row q-col-gutter-lg">
      <div
        v-for="product in products"
        :key="product.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <ItemCard
          :item="product"
          :isFavorited="favoritedIds.includes(product.id)"
          @view="emitView(product)"
          @toggle-favorite="emitToggleFavorite(product)"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="q-mt-xl text-center text-grey">
      <q-icon name="search_off" size="42px" class="q-mb-sm" />
      <div class="text-subtitle2">No products found.</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { Product } from 'src/types'
import ItemCard from './ItemCard.vue'

export default defineComponent({
  name: 'ProductList',
  components: { ItemCard },
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
  emits: ['view-item', 'toggle-favorite'],
  methods: {
    emitView(product: Product) {
      this.$emit('view-item', product)
    },
    emitToggleFavorite(product: Product) {
      this.$emit('toggle-favorite', product)
    }
  }
})
</script>

<style scoped>
.product-list {
  padding-bottom: 32px;
}
</style>
