<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-white text-dark">
      <q-toolbar>
        <!-- Logo -->
        <q-toolbar-title>
          <q-avatar>
            <img src="/minato-logo.png" alt="Minato logo" />
          </q-avatar>
          Minato
        </q-toolbar-title>

        <q-space />

        <!-- Search -->
        <q-input
          standout
          filled
          dense
          debounce="300"
          v-model="search"
          placeholder="Search for anything..."
          class="q-mr-md"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <!-- Cart with Badge -->
        <div class="q-mr-sm" style="position: relative;">
          <q-btn flat round icon="shopping_cart" @click="showCart = true" />
          <q-badge
            v-if="cartCount > 0"
            color="red"
            floating
            transparent
            :label="cartCount"
            style="top: -4px; right: -4px; position: absolute;"
          />
        </div>

        <!-- Auth Buttons -->
        <template v-if="!isAuthenticated">
          <q-btn flat label="Login" class="q-ml-sm" @click="showLogin = true" />
          <q-btn flat label="Register" class="q-ml-sm" @click="showRegister = true" />
        </template>
        <template v-else>
          <q-btn
            flat
            icon="add"
            label="Add Item"
            class="q-ml-sm"
            @click="router.push('/products/new')"
          />
          <q-btn flat icon="logout" class="q-ml-sm" @click="logout" />
        </template>
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item-label header>Categories</q-item-label>
        <q-item
          v-for="category in categories"
          :key="category.id"
          clickable
        >
          <q-item-section>{{ category.name }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Modals -->
    <LoginModal v-if="showLogin" @close="showLogin = false" />
    <RegisterModal v-if="showRegister" @close="showRegister = false" />
    <CartModal v-if="showCart" @close="handleCartClose" />
  </q-layout>
</template>

<script lang="ts">
import { ref, computed, onMounted } from 'vue'
import { logout } from 'src/services/api/auth/authApi'
import { useRouter } from 'vue-router'
import { getCategories } from 'src/services/api/categories/categories'

import LoginModal from 'src/components/modals/LoginModal.vue'
import RegisterModal from 'src/components/modals/RegisterModal.vue'
import CartModal from 'src/components/modals/CartModal.vue'

interface Category {
  id: number
  name: string
}

export default {
  name: 'MainLayout',
  components: {
    LoginModal,
    RegisterModal,
    CartModal
  },
  setup () {
    const router = useRouter()

    const search = ref('')
    const showLogin = ref(false)
    const showRegister = ref(false)
    const showCart = ref(false)
    const leftDrawerOpen = ref(true)
    const categories = ref<Category[]>([])

    onMounted(async () => {
      try {
        const res = await getCategories()
        console.log('📦 Categories API response:', res.data)

        // Adjust this based on actual API format
        categories.value = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.categories)
            ? res.data.categories
            : []
      } catch (err) {
        console.error('❌ Failed to load categories:', err)
      }
    })

    const isAuthenticated = computed(() => {
      return !!localStorage.getItem('authToken')
    })

    const handleLogout = async () => {
      try {
        await logout()
        localStorage.removeItem('authToken')
        void router.push('/')
      } catch (err) {
        console.error('Logout failed:', err)
      }
    }

    const cartCount = ref(0)

    const updateCartCount = () => {
      const raw = JSON.parse(localStorage.getItem('cart') || '[]')
      cartCount.value = Array.isArray(raw) ? raw.length : 0
    }

    updateCartCount()

    const handleCartClose = () => {
      showCart.value = false
      updateCartCount()
    }

    return {
      search,
      showLogin,
      showRegister,
      showCart,
      leftDrawerOpen,
      categories,
      isAuthenticated,
      logout: handleLogout,
      cartCount,
      handleCartClose,
      router
    }
  }
}
</script>

<style scoped>
.q-toolbar-title {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
