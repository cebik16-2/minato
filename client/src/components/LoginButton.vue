<template>
    <q-btn
      label="Login"
      color="primary"
      icon="login"
      @click="openLogin"
      class="q-mx-sm"
    />
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import { useAuthStore } from 'src/stores/authStore'
  
  export default defineComponent({
    name: 'LoginButton',
    setup () {
      const authStore = useAuthStore()
  
      const openLogin = () => {
        authStore.openLoginModal()
      }
  
      return {
        openLogin
      }
    }
  })
  </script>
  