<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="max-width: 500px; width: 100%">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Add New Item</div>
        <q-space />
        <q-btn flat round icon="close" @click="$emit('close')" />
      </q-card-section>

      <q-card-section>
        <q-input v-model="form.name" label="Item Name" dense filled class="q-mb-sm" />
        <q-input v-model="form.price" label="Price (EUR)" type="number" dense filled class="q-mb-sm" />
        <q-input v-model="form.image" label="Image URL" dense filled class="q-mb-sm" />
        <q-btn
          label="Add Item"
          color="primary"
          class="full-width q-mt-md"
          @click="handleAdd"
          :loading="loading"
        />
        <q-btn
          flat
          label="Cancel"
          class="full-width q-mt-sm"
          @click="$emit('close')"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'AddItemModal',
  emits: ['close', 'item-added'],
  setup(_, { emit }) {
    const dialog = ref(true)
    const loading = ref(false)

    const form = ref({
      name: '',
      price: '',
      image: ''
    })

    // eslint-disable-next-line @typescript-eslint/require-await
    const handleAdd = () => {
      if (!form.value.name || !form.value.price || !form.value.image) {
        return alert('Please fill in all fields')
      }

      loading.value = true
      try {
        emit('item-added', {
          ...form.value,
          id: Date.now()
        })
        emit('close')
      } catch (err) {
        console.error('Failed to add item:', err)
      } finally {
        loading.value = false
      }
    }

    return {
      dialog,
      form,
      loading,
      handleAdd
    }
  }
})
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
