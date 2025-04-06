<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="email" label="Email" type="email" />
        <q-input v-model="password" label="Password" type="password" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" @click="show = false" />
        <q-btn flat label="Login" color="primary" @click="login" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const show = ref(true)
const email = ref('')
const password = ref('')
const $q = useQuasar()

const login = async () => {
  try {
    const response = await api.post('/auth/sign_in', {
      email: email.value,
      password: password.value
    })

    // Extract Devise Token Auth headers
    const headers = response.headers
    const authToken = {
      'access-token': headers['access-token'],
      client: headers['client'],
      uid: headers['uid']
    }

    if (!authToken['access-token'] || !authToken.client || !authToken.uid) {
      throw new Error('❌ Missing authentication headers')
    }

    // Store in localStorage for reuse
    localStorage.setItem('authToken', JSON.stringify(authToken))

    // Inject headers into axios globally
    api.defaults.headers.common['access-token'] = authToken['access-token']
    api.defaults.headers.common['client'] = authToken.client
    api.defaults.headers.common['uid'] = authToken.uid

    $q.notify({ type: 'positive', message: '✅ Logged in successfully!' })
    show.value = false
  } catch (err) {
    console.error('Login failed:', err)
    $q.notify({ type: 'negative', message: '❌ Login failed. Check credentials or backend.' })
  }
}
</script>
