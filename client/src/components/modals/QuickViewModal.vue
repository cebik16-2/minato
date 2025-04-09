<template>
  <q-dialog v-model="dialog" persistent>
    <q-card v-if="item" style="max-width: 500px; width: 100%">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ item.title }}</div>
        <q-space />
        <q-btn flat round icon="close" @click="$emit('close')" />
      </q-card-section>

      <q-card-section>
        <q-img
          :src="item.thumbnail_url || ''"
          :alt="item.title"
          class="rounded-borders"
          height="200px"
        />
        <div class="text-subtitle1 q-mt-md">€ {{ item.price }}</div>
        <div class="text-caption text-grey-7 q-mt-sm">
          {{ item.description }}
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Add to Cart"
          color="primary"
          icon="shopping_cart"
          @click="$emit('add-to-cart', item)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { PropType } from 'vue'
import type { Product } from 'src/types'

export default defineComponent({
  name: 'QuickViewModal',
  props: {
    item: {
      type: Object as PropType<Product | null>,
      required: false
    },
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'add-to-cart', 'update:modelValue'],
  setup(props, { emit }) {
    const dialog = ref(props.modelValue)

    watch(() => props.modelValue, (val) => {
      dialog.value = val
    })

    watch(dialog, (val) => {
      if (!val) {
        emit('close')
        emit('update:modelValue', false)
      }
    })

    return {
      dialog
    }
  }
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
  object-fit: cover;
}
</style>
