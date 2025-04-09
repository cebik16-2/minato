<template>
  <div>
    <div class="row q-col-gutter-md">
      <div
        v-for="product in products"
        :key="product.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <ItemCard
          :item="product"
          :isFavorited="favoritedIds.includes(product.id)"
          @view="emitView(product)"
          @toggle-favorite="emitToggleFavorite(product)"
        />
      </div>
    </div>

    <div v-if="!products.length" class="text-center q-mt-lg text-grey">
      No products found.
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { Product } from 'src/types'
import ItemCard from './ItemCard.vue'

export default {
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
}
</script>
