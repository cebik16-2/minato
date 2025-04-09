<template>
  <q-card class="hoverable cursor-pointer relative-position">
    <!-- Favorite Icon -->
    <q-btn
      flat
      round
      size="sm"
      icon="favorite"
      :color="isFavorited ? 'red' : 'grey-5'"
      class="absolute-top-right q-ma-xs favorite-btn"
      :class="{ 'animate-favorite': isFavorited }"
      @click.stop="$emit('toggle-favorite', item)"
    />

    <!-- Product Image -->
    <q-img
      :src="item.thumbnail_url || ''"
      :alt="item.title"
      height="150px"
    />

    <!-- Info -->
    <q-card-section @click="$emit('view', item)">
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
    },
    isFavorited: {
      type: Boolean,
      required: true
    }
  },
  emits: ['view', 'toggle-favorite']
}
</script>

<style scoped>
.favorite-btn {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.animate-favorite {
  animation: pulse 0.35s ease;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
  }
}
</style>
