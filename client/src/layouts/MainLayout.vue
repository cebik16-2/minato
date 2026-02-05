<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated :class="isDark ? 'bg-dark text-white' : 'bg-white text-dark'">
      <q-toolbar>
        <!-- Logo -->
        <q-toolbar-title shrink class="cursor-pointer" @click="router.push('/')">
          <q-avatar>
            <img src="/minato-logo.png" alt="Minato logo" />
          </q-avatar>
          Minato
        </q-toolbar-title>

        <q-space />

        <!-- Search -->
        <q-input filled dense debounce="300" v-model="search" placeholder="Search for anything..." class="q-mr-md"
          :bg-color="isDark ? 'grey-9' : 'grey-2'" :standout="isDark ? 'bg-grey-8' : 'bg-grey-3'">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <!-- Cart with Badge -->
        <div class="q-mr-sm" style="position: relative;">
          <q-btn flat round icon="shopping_cart" @click="showCart = true" />
          <q-badge v-if="cartCount > 0" color="red" floating transparent :label="cartCount"
            style="top: -4px; right: -4px; position: absolute;" />
        </div>

        <!-- Dark Mode Toggle -->
        <q-btn flat round :icon="isDark ? 'dark_mode' : 'light_mode'" @click="toggleDarkMode" class="q-mr-sm" />

        <!-- Auth Buttons -->
        <template v-if="!isAuthenticated">
          <q-btn flat label="Login" class="q-ml-sm" @click="openLoginModal" />
          <q-btn flat label="Register" class="q-ml-sm" @click="showRegister = true" />
        </template>
        <template v-else>
          <q-btn flat icon="add" label="Add Item" class="q-ml-sm" @click="router.push('/products/new')" />
          <q-btn flat icon="account_circle" class="q-ml-sm" @click="router.push('/account')" />
          <q-btn flat icon="logout" class="q-ml-sm" @click="logout" />
        </template>
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered v-if="shouldShowDrawer"
      :class="isDark ? 'bg-dark' : 'bg-grey-1'"> <q-list class="q-pa-md">
        <div class="text-subtitle2 q-mb-sm text-grey-8">FILTER BY CATEGORY</div>
        <q-item v-for="category in categories" :key="category.id" clickable @click="selectCategory(category)"
          :active="selectedCategoryId === category.id" active-class="bg-blue-1 text-primary" dense
          class="rounded-borders">
          <q-item-section>{{ category.name }}</q-item-section>
        </q-item>

        <q-item clickable @click="clearCategory" :active="selectedCategoryId === null"
          active-class="bg-blue-1 text-primary" dense class="rounded-borders q-mt-xs">
          <q-item-section>All Categories</q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <!-- Price Range -->
        <div class="text-subtitle2 q-mb-sm text-grey-8">PRICE RANGE</div>
        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-input v-model.number="filters.minPrice" type="number" placeholder="Min" outlined dense bg-color="white"
              @change="applyFilters" />
          </div>
          <div class="col-6">
            <q-input v-model.number="filters.maxPrice" type="number" placeholder="Max" outlined dense bg-color="white"
              @change="applyFilters" />
          </div>
        </div>

        <q-separator class="q-my-md" />

        <!-- City -->
        <div class="text-subtitle2 q-mb-sm text-grey-8">LOCATION</div>
        <q-input v-model="filters.city" placeholder="Enter city..." outlined dense bg-color="white"
          @change="applyFilters">
          <template v-slot:append>
            <q-icon name="place" size="xs" color="grey" />
          </template>
        </q-input>

      </q-list>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Modals -->
    <LoginModal v-if="showLogin" @close="closeLoginModal" />
    <RegisterModal v-if="showRegister" @close="showRegister = false" />
    <CartModal v-if="showCart" @close="handleCartClose" />
  </q-layout>
</template>

<script lang="ts">
import { ref, onMounted, computed, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { getCategories } from 'src/services/api/categories/categories'
import { useAuthStore } from 'src/stores/authStore'
import { storeToRefs } from 'pinia'

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
  setup() {
    const router = useRouter()
    const route = useRoute()
    const $q = useQuasar()
    const authStore = useAuthStore()
    const { isAuthenticated, showLoginModal } = storeToRefs(authStore)

    // Dark mode state
    const isDark = computed(() => $q.dark.isActive)

    const toggleDarkMode = () => {
      $q.dark.toggle()
      localStorage.setItem('darkMode', JSON.stringify($q.dark.isActive))
    }

    const isLandingPage = computed(() => route.name === 'landing')
    const isProductDetailPage = computed(() => route.name === 'product-detail')
    const shouldShowDrawer = computed(() => !isLandingPage.value && !isProductDetailPage.value)

    const search = ref('')
    const showRegister = ref(false)
    const showCart = ref(false)
    const leftDrawerOpen = ref(true)
    const categories = ref<Category[]>([])
    const selectedCategoryId = ref<number | null>(null)

    const filters = reactive({
      minPrice: null as number | null,
      maxPrice: null as number | null,
      city: ''
    })

    const applyFilters = () => {
      const query: Record<string, any> = { ...route.query }

      if (filters.minPrice) query['min_price'] = filters.minPrice
      else delete query['min_price']

      if (filters.maxPrice) query['max_price'] = filters.maxPrice
      else delete query['max_price']

      if (filters.city) query['city'] = filters.city
      else delete query['city']

      void router.push({ query })
    }

    const selectCategory = (category: Category) => {
      selectedCategoryId.value = category.id
      console.log(`📁 Selecting category: ${category.name} (id: ${category.id})`)
      const query = { ...route.query, category: category.id }
      void router.push({ name: 'marketplace', query })
    }

    const clearCategory = () => {
      selectedCategoryId.value = null
      const query: Record<string, any> = { ...route.query }
      delete query['category']
      void router.push({ name: 'marketplace', query })
    }

    const openLoginModal = () => authStore.openLoginModal()
    const closeLoginModal = () => authStore.closeLoginModal()

    const cartCount = ref(0)

    const updateCartCount = () => {
      const raw = JSON.parse(localStorage.getItem('cart') || '[]')
      cartCount.value = Array.isArray(raw) ? raw.length : 0
    }

    const handleCartClose = () => {
      showCart.value = false
      updateCartCount()
    }

    onMounted(async () => {
      try {
        const res = await getCategories()
        categories.value = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.categories)
            ? res.data.categories
            : []
      } catch (err) {
        console.error('❌ Failed to load categories:', err)
      }
      updateCartCount()

      // Initialize filters from URL
      const categoryParam = route.query['category']
      if (categoryParam) {
        selectedCategoryId.value = Number(categoryParam)
      }

      if (route.query['min_price']) filters.minPrice = Number(route.query['min_price'])
      if (route.query['max_price']) filters.maxPrice = Number(route.query['max_price'])
      if (route.query['city']) filters.city = String(route.query['city'])

      // Initialize dark mode
      const storedDark = localStorage.getItem('darkMode')
      if (storedDark) {
        $q.dark.set(JSON.parse(storedDark))
      }
    })

    // Watch for route changes to update selected category
    watch(() => route.query['category'], (newVal) => {
      selectedCategoryId.value = newVal ? Number(newVal) : null
    })

    return {
      router,
      search,
      showLogin: showLoginModal,
      openLoginModal,
      closeLoginModal,
      showRegister,
      showCart,
      leftDrawerOpen,
      categories,
      isAuthenticated,
      logout: authStore.logout,
      cartCount,
      handleCartClose,
      selectCategory,
      clearCategory,
      selectedCategoryId,
      isLandingPage,
      isProductDetailPage,
      shouldShowDrawer,
      filters,
      applyFilters,
      isDark,
      toggleDarkMode
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
