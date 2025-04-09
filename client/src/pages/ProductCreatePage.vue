<template>
    <q-page class="q-pa-md q-gutter-md">
      <h2 class="text-h5">Create New Product</h2>
  
      <q-form @submit.prevent="submitForm" ref="formRef">
        <q-input v-model="form.title" label="Title" filled required />
  
        <q-input
          v-model="form.description"
          label="Description"
          type="textarea"
          filled
          required
        />
  
        <q-input
          v-model.number="form.price"
          label="Price (€)"
          type="number"
          filled
          required
          min="0"
        />
  
        <q-select
          v-model="form.category_id"
          label="Category"
          :options="categories"
          option-value="id"
          option-label="name"
          filled
          required
          emit-value
          map-options
        />
  
        <q-uploader
          label="Upload Images"
          multiple
          accept="image/*"
          :auto-upload="false"
          @added="onFilesAdded"
          ref="uploaderRef"
        />
  
        <div class="q-mt-md">
          <q-btn label="Submit" type="submit" color="primary" />
        </div>
      </q-form>
  
      <q-dialog v-model="successDialog">
        <q-card>
          <q-card-section>
            <div class="text-h6">Product Created</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="OK" @click="router.push('/')" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { api } from 'src/boot/axios'
  import { getCategories } from 'src/services/api/categories/categories'
  
  const router = useRouter()
  
  const form = ref({
    title: '',
    description: '',
    price: 0,
    category_id: null,
    files: [] as File[]
  })
  
  const categories = ref([])
  const successDialog = ref(false)
  const uploaderRef = ref()
  
  onMounted(async () => {
    try {
      const res = await getCategories()
      categories.value = res.data.categories || res.data
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  })
  
  const onFilesAdded = (files: readonly File[]) => {
    form.value.files = Array.from(files)
  }
  
  const submitForm = async () => {
    try {
      const payload = new FormData()
      payload.append('product[title]', form.value.title)
      payload.append('product[description]', form.value.description)
      payload.append('product[price]', form.value.price.toString())
      payload.append('product[category_id]', String(form.value.category_id))
  
      form.value.files.forEach((file) => {
        payload.append('product[files][]', file)
      })
  
      await api.post('/products', payload)
  
      successDialog.value = true
    } catch (err) {
      console.error('Failed to submit product:', err)
    }
  }
  </script>
  