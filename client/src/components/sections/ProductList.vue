<template>
  <div>
    <div class="row q-col-gutter-md">
      <div
        v-for="item in items"
        :key="item.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <ItemCard :item="item" @view="handleView" />
      </div>
    </div>

    <div v-if="!items.length" class="text-center q-mt-lg text-grey">
      No products found.
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { Item } from 'src/types'
import ItemCard from './ItemCard.vue'

export default {
  name: 'ProductList',
  components: {
    ItemCard
  },
  props: {
    items: {
      type: Array as PropType<Item[]>,
      required: true
    }
  },
  emits: ['view-item'],
  methods: {
    handleView(item: Item) {
      this.$emit('view-item', item)
    }
  }
}
</script>
