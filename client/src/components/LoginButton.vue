<template>
    <div>
      <q-btn label="🔐 Login" color="primary" @click="show = true" />
      <LoginModal v-model:show="show" @login-success="handleSuccess" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import LoginModal from './LoginModal.vue'
  
  const show = ref(false)
  
  const handleSuccess = () => {
    // Optional: emit to parent or perform further actions
    console.log('✅ User logged in')
  }
  </script>
  