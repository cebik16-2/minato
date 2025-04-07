<template>
  <q-dialog v-model="dialog" persistent>
    <q-card class="q-pa-md" style="min-width: 300px; max-width: 400px">
      <q-card-section>
        <div class="text-h6">Login to Minato</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="email" label="Email" type="email" dense filled class="q-mb-sm" />
        <q-input v-model="password" label="Password" type="password" dense filled class="q-mb-sm" />
        <q-btn
          label="Login"
          color="primary"
          class="full-width q-mt-md"
          @click="handleLogin"
          :loading="loading"
        />
        <q-btn flat label="Cancel" class="full-width q-mt-sm" @click="$emit('close')" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { ref } from 'vue'
import { login } from 'src/services/api/auth/authApi'

export default {
  name: 'LoginModal',
  emits: ['close'],
  setup(_, { emit }) {
    const dialog = ref(true)
    const email = ref('')
    const password = ref('')
    const loading = ref(false)

    const handleLogin = async () => {
      loading.value = true
      try {
        await login({ email: email.value, password: password.value })

        // If login succeeds (handled inside authApi), close modal
        emit('close')
      } catch (err) {
        console.error('❌ Login failed:', err)
        // Optional: Show toast or error message here
      } finally {
        loading.value = false
      }
    }

    return {
      dialog,
      email,
      password,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
