<template>
    <q-dialog v-model="show">
      <q-card class="q-pa-md" style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Login</div>
        </q-card-section>
  
        <q-card-section>
          <q-input v-model="email" label="Email" />
          <q-input v-model="password" label="Password" type="password" />
        </q-card-section>
  
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn label="Login" color="primary" @click="login" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useQuasar } from 'quasar'
  import axios from 'axios'
  
  const show = ref(true)
  const email = ref('')
  const password = ref('')
  const $q = useQuasar()
  
  const login = async () => {
    try {
      const response = await axios.post('http://localhost:3000/users/sign_in', {
        user: {
          email: email.value,
          password: password.value
        }
      })
  
      const headers = response.headers
      const token = {
        'access-token': headers['access-token'],
        client: headers['client'],
        uid: headers['uid']
      }
  
      localStorage.setItem('authToken', JSON.stringify(token))
      $q.notify({ type: 'positive', message: '✅ Logged in successfully!' })
      show.value = false
    } catch (err) {
      console.error('Login failed:', err)
      $q.notify({ type: 'negative', message: '❌ Login failed. Check credentials.' })
    }
  }
  </script>
  