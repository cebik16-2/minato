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

        <!-- Spacer -->
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

        <!-- Cart -->
        <q-btn flat round icon="shopping_cart" @click="showCart = true" />

        <!-- Auth Buttons -->
        <template v-if="!isAuthenticated">
          <q-btn flat label="Login" class="q-ml-sm" @click="showLogin = true" />
          <q-btn flat label="Register" class="q-ml-sm" @click="showRegister = true" />
        </template>
        <template v-else>
          <q-btn flat icon="logout" @click="logout" class="q-ml-sm" />
        </template>

      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item-label header>Categories</q-item-label>
        <q-item
          clickable
          v-for="category in categories"
          :key="category"
        >
          <q-item-section>{{ category }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page Content (uses routed views) -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Modals -->
    <LoginModal v-if="showLogin" @close="showLogin = false" />
    <RegisterModal v-if="showRegister" @close="showRegister = false" />
    <CartModal v-if="showCart" @close="showCart = false" />
  </q-layout>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { logout } from 'src/services/api/auth/authApi'
import { useRouter } from 'vue-router'

import LoginModal from 'src/components/modals/LoginModal.vue'
import RegisterModal from 'src/components/modals/RegisterModal.vue'
import CartModal from 'src/components/modals/CartModal.vue'

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

    const categories = [
      'Electronics',
      'Fashion',
      'Home & Garden',
      'Sport',
      'Toys',
      'Motors'
    ]

    const isAuthenticated = computed(() => {
      const token = localStorage.getItem('authToken')
      return !!token
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

    return {
      search,
      showLogin,
      showRegister,
      showCart,
      leftDrawerOpen,
      categories,
      isAuthenticated,
      logout: handleLogout
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
