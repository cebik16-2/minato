<template>
  <div class="row q-col-gutter-md q-mt-lg">
    <!-- Image -->
    <div class="col-12 col-md-6">
      <q-img
        :src="item.thumbnail_url || ''"
        :alt="item.title"
        class="rounded-borders"
        style="max-height: 300px"
      />
    </div>

    <!-- Info -->
    <div class="col-12 col-md-6">
      <div class="text-h5 text-bold">{{ item.title }}</div>
      <div class="text-subtitle1 text-primary q-mt-sm">€ {{ item.price }}</div>

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
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { Product } from 'src/types'

export default {
  name: 'ItemDetailSection',
  props: {
    item: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  emits: ['add-to-cart', 'back']
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
  object-fit: cover;
}
</style>
