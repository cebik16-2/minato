<template>
  <q-card class="hoverable cursor-pointer" @click="$emit('view', item)">
    <q-img :src="item.image" :alt="item.name" height="150px" />
    <q-card-section>
      <div class="text-subtitle1">{{ item.name }}</div>
      <div class="text-bold text-primary">{{ item.price }}</div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { Item } from 'src/types'

export default {
  name: 'ItemCard',
  props: {
    item: {
      type: Object as PropType<Item>,
      required: true
    }
  },
  emits: ['view']
}
</script>
