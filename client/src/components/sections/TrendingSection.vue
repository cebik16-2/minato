<template>
  <div class="q-mt-xl">
    <div class="text-h6 q-mb-md">Trending Items</div>
    <ProductList :items="items" @view-item="$emit('view-item', $event)" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { Item } from 'src/types'
import ProductList from './ProductList.vue'

export default defineComponent({
  name: 'TrendingSection',
  components: { ProductList },
  props: {
    items: {
      type: Array as PropType<Item[]>,
      required: true
    }
  },
  emits: ['view-item']
})
</script>
