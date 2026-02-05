<template>
    <q-page class="q-pa-md">
      <div class="row items-center justify-between q-mb-lg">
        <div class="text-h5">My Products</div>
        <q-btn color="primary" label="+ New Product" @click="goToNewProduct" />
      </div>
  
      <q-list v-if="products.length">
        <q-item
          v-for="product in products"
          :key="product.id"
          class="q-mb-sm q-pa-sm bg-grey-1 rounded-borders"
        >
          <q-item-section>
            <div class="text-subtitle1">{{ product.title }}</div>
            <div class="text-caption ellipsis-2-lines">{{ product.description }}</div>
          </q-item-section>
  
          <q-item-section side class="q-gutter-sm">
            <q-btn flat dense icon="edit" color="primary" @click="editProduct(product.id)" />
            <q-btn flat dense icon="delete" color="negative" @click="confirmDelete(product.id)" />
          </q-item-section>
        </q-item>
      </q-list>
  
      <div v-else class="text-center text-grey-6 q-mt-xl">
        <q-icon name="inventory_2" size="64px" />
        <p class="q-mt-md">You haven’t added any products yet.</p>
        <q-btn color="primary" label="Add your first product" @click="goToNewProduct" />
      </div>
    </q-page>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { getUserProducts, deleteProduct } from 'src/services/api/products/products'
  import type { Product } from 'src/types'
  
  const products = ref<Product[]>([])
  const router = useRouter()
  
  const fetchUserProducts = async () => {
    try {
      const response = await getUserProducts()
      products.value = response.data
    } catch (err) {
      console.error('Error fetching user products:', err)
    }
  }
  
  const goToNewProduct = () => router.push('/products/new')
  const editProduct = (id: number) => router.push(`/products/${id}/edit`)
  
  const confirmDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this product?')
    if (!confirmed) return
  
    try {
      await deleteProduct(id)
      products.value = products.value.filter(product => product.id !== id)
    } catch (err) {
      console.error('Failed to delete product:', err)
    }
  }
  
  onMounted(fetchUserProducts)
  </script>
  