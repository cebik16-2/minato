<template>
  <q-card class="item-card hoverable cursor-pointer relative-position q-pa-none">
    <!-- Favorite Icon -->
    <q-btn
      flat
      round
      dense
      icon="favorite"
      :color="isFavorited ? 'red' : 'grey-6'"
      class="absolute-top-right q-ma-sm favorite-btn"
      :class="{ 'animate-favorite': isFavorited }"
      @click.stop="$emit('toggle-favorite', item)"
      :aria-label="isFavorited ? 'Remove from favorites' : 'Add to favorites'"
    />

    <!-- Product Image -->
    <q-img
      :src="item.thumbnail_url || placeholderImage"
      :alt="item.title || 'No title'"
      height="160px"
      ratio="16/9"
      class="product-img"
      spinner-color="primary"
      @click="$emit('view', item)"
    />

    <!-- Product Info -->
    <q-card-section class="q-py-sm q-px-md" @click="$emit('view', item)">
      <div class="text-subtitle2 text-weight-medium ellipsis">{{ item.title }}</div>
      <div class="text-primary text-bold q-mt-xs">€ {{ item.price?.toFixed(2) || 'N/A' }}</div>
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
  emits: ['view', 'toggle-favorite'],
  setup() {
    const placeholderImage = 'https://via.placeholder.com/300x200?text=No+Image'
    return { placeholderImage }
  }
}
</script>

<style scoped>
.item-card {
  transition: transform 0.2s ease;
  border-radius: 12px;
  overflow: hidden;
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.favorite-btn {
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 1;
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

.product-img {
  object-fit: cover;
}
</style>
