<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Your Cart</div>
        <q-space />
        <q-btn flat round icon="close" @click="close" />
      </q-card-section>

      <q-separator />

      <q-card-section v-if="cart.length">
        <div
          v-for="(item, index) in cart"
          :key="item.id"
          class="q-mb-md"
        >
          <div class="text-subtitle1">{{ item.title }}</div>
          <div class="text-primary">€ {{ item.price }}</div>
          <q-btn
            flat
            icon="delete"
            color="negative"
            label="Remove"
            @click="removeItem(index)"
            class="q-mt-sm"
          />
          <q-separator spaced />
        </div>
      </q-card-section>

      <q-card-section v-else>
        <div class="text-grey">Your cart is empty.</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { Product } from 'src/types'

export default defineComponent({
  name: 'CartModal',
  emits: ['close'],
  setup(_, { emit }) {
    const dialog = ref(true)

    const cart = ref<Product[]>(
      JSON.parse(localStorage.getItem('cart') || '[]')
    )

    const removeItem = (index: number) => {
      cart.value.splice(index, 1)
      localStorage.setItem('cart', JSON.stringify(cart.value))
    }

    const close = () => {
      emit('close')
      dialog.value = false
    }

    return {
      dialog,
      cart,
      removeItem,
      close
    }
  }
})
</script>
