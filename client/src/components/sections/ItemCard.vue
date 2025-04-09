<template>
  <q-card class="hoverable cursor-pointer" @click="$emit('view', item)">
    <q-img :src="item.thumbnail_url || ''" :alt="item.title" height="150px" />
    <q-card-section>
      <div class="text-subtitle1 ellipsis">{{ item.title }}</div>
      <div class="text-bold text-primary">€ {{ item.price }}</div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { Product } from 'src/types'

export default {
  name: 'ItemCard',
  props: {
    item: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  emits: ['view']
}
</script>
