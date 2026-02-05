<template>
  <div class="vintage-product-list q-pa-md">
    <div v-if="products.length" class="row q-col-gutter-lg">
      <div v-for="product in products" :key="product.id" class="col-12">
        <q-card flat bordered class="row no-wrap items-stretch bg-white vintage-card cursor-pointer"
          @click="$emit('view-item', product)">
          <!-- Left: Image -->
          <div class="col-12 col-sm-4 col-md-3 relative-position">
            <q-img
              :src="product.image_urls?.[0] || product.thumbnail_url || 'https://placehold.co/600x400?text=No+Image'"
              :ratio="4 / 3" class="full-height" fit="cover">
              <div class="absolute-bottom text-subtitle2 text-center bg-transparent-black">
                {{ product.year || '—' }}
              </div>
            </q-img>
            <q-btn round flat color="white" icon="favorite" class="absolute-top-right q-ma-sm z-top"
              :class="{ 'text-red': favoritedIds.includes(product.id) }"
              @click.stop="$emit('toggle-favorite', product)" />
          </div>

          <!-- Right: Details -->
          <div class="col-12 col-sm-8 col-md-9 q-pa-md flex column justify-between">
            <div>
              <div class="row items-center justify-between q-mb-sm">
                <div class="text-h6 font-mono text-uppercase text-grey-9 text-weight-bold">
                  {{ product.title }}
                </div>
                <div class="text-h6 text-orange-9 text-weight-bolder">
                  ${{ product.price.toLocaleString() }}
                </div>
              </div>

              <div class="text-body2 text-grey-7 q-mb-md ellipsis-2-lines">
                {{ product.description }}
              </div>

              <!-- Specs Grid -->
              <div class="row q-col-gutter-x-xl q-col-gutter-y-sm text-caption text-grey-8 font-mono q-mb-md">
                <div class="col-auto">
                  <q-icon name="factory" class="q-mr-xs" />
                  {{ product.manufacturer || '—' }}
                </div>
                <div class="col-auto">
                  <q-icon name="handyman" class="q-mr-xs" />
                  {{ product.condition || 'Used' }}
                </div>
                <!-- Location would go here if available in type -->
                <div class="col-auto">
                  <q-icon name="place" class="q-mr-xs" />
                  Texas, USA
                </div>
              </div>
            </div>

            <div class="row justify-end q-gutter-sm">
              <q-btn outline color="grey-9" label="View Details" class="font-mono text-weight-bold" no-caps
                @click="$emit('view-item', product)" />
              <q-btn unelevated color="orange-9" label="Contact Seller" class="font-mono text-weight-bold" no-caps />
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="q-mt-xl text-center text-grey">
      <q-icon name="search_off" size="42px" class="q-mb-sm" />
      <div class="text-subtitle2">No trucks found matching your criteria.</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { Product } from 'src/types'

export default defineComponent({
  name: 'VintageProductList',
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
.font-mono {
  font-family: 'Roboto Mono', monospace;
}

.vintage-card {
  border: 1px solid #e0e0e0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.vintage-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -2px rgba(0, 0, 0, 0.1);
  border-color: #F57C00;
}

.bg-transparent-black {
  background: rgba(0, 0, 0, 0.6);
}
</style>
