<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="min-width: 400px; max-width: 90vw;">
      <q-card-section>
        <div class="text-h6">🛒 Your Cart</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div v-if="cartItems.length === 0">
          Your cart is empty.
        </div>
        <div v-else>
          <q-list bordered separator>
            <q-item v-for="(entry, index) in cartItems" :key="entry.product.id">
              <q-item-section avatar>
                <q-avatar square size="56px">
                  <img :src="entry.product.thumbnail_url || entry.product.image_urls[0] || '/placeholder.png'" alt="Product image" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ entry.product.title }}</q-item-label>
                <q-item-label caption>€{{ entry.product.price }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="row items-center q-gutter-sm">
                  <q-btn dense round icon="remove" size="sm" @click="decreaseQty(index)" />
                  <span>{{ entry.quantity }}</span>
                  <q-btn dense round icon="add" size="sm" @click="increaseQty(index)" />
                  <q-btn dense flat icon="delete" color="red" @click="removeItem(index)" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="text-right">
        <div class="text-subtitle1 q-mb-sm">
          Total: €{{ totalPrice }}
        </div>
        <q-btn label="Close" color="primary" flat @click="close" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import type { Product } from 'src/types'

export type CartEntry = {
  product: Product
  quantity: number
}

export default defineComponent({
  name: 'CartModal',
  emits: ['close'],
  setup(_, { emit }) {
    const dialog = ref(true)

    const loadCart = (): CartEntry[] => {
      const raw = JSON.parse(localStorage.getItem('cart') || '[]') as Product[]
      const grouped: Record<number, CartEntry> = {}

      raw.forEach((product) => {
        const id = product?.id
        if (id == null) return

        if (grouped[id]) {
          grouped[id].quantity++
        } else {
          grouped[id] = { product, quantity: 1 }
        }
      })

      return Object.values(grouped)
    }

    const cartItems = ref<CartEntry[]>(loadCart())

    const syncCart = () => {
      const flat = cartItems.value.flatMap(entry =>
        Array(entry.quantity).fill(entry.product)
      )
      localStorage.setItem('cart', JSON.stringify(flat))
    }

    const removeItem = (index: number) => {
      if (cartItems.value[index]) {
        cartItems.value.splice(index, 1)
        syncCart()
      }
    }

    const increaseQty = (index: number) => {
      const entry = cartItems.value[index]
      if (entry) {
        entry.quantity++
        syncCart()
      }
    }

    const decreaseQty = (index: number) => {
      const entry = cartItems.value[index]
      if (entry && entry.quantity > 1) {
        entry.quantity--
        syncCart()
      }
    }

    const totalPrice = computed(() =>
      cartItems.value.reduce((total, entry) => {
        return total + entry.quantity * Number(entry.product.price)
      }, 0).toFixed(2)
    )

    const close = () => {
      emit('close')
      dialog.value = false
    }

    return {
      dialog,
      cartItems,
      removeItem,
      increaseQty,
      decreaseQty,
      totalPrice,
      close
    }
  }
})
</script>
