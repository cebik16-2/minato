<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="min-width: 300px">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-input
          v-model="email"
          label="Email"
          type="email"
          dense
          filled
        />
        <q-input
          v-model="password"
          label="Password"
          type="password"
          dense
          filled
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="secondary" @click="dialog = false" />
        <q-btn
          :loading="loading"
          label="Login"
          color="primary"
          @click="handleLogin"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from 'src/services/api/auth/authApi'
import { useAuthStore } from 'src/stores/authStore'
import { Notify } from 'quasar'

export default {
  name: 'LoginModal',
  setup() {
    const dialog = ref(true)
    const email = ref('')
    const password = ref('')
    const loading = ref(false)

    const router = useRouter()
    const authStore = useAuthStore()

    const handleLogin = async () => {
      loading.value = true
      try {
        const response = await login({
          email: email.value,
          password: password.value
        })

        const headers = response?.headers

        const authToken = {
          'access-token': headers['access-token'],
          client: headers['client'],
          uid: headers['uid']
        }

        if (authToken['access-token'] && authToken.client && authToken.uid) {
          authStore.login(authToken)

          Notify.create({
            type: 'positive',
            message: 'Login successful!',
            position: 'top'
          })

          dialog.value = false

          if (authStore.redirectAfterLogin) {
            await router.push(authStore.redirectAfterLogin)
            authStore.redirectAfterLogin = null
          }
        } else {
          throw new Error('Missing authentication headers from server')
        }
      } catch (err: unknown) {
        console.error('❌ Login failed:', err)

        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Login failed. Please check your credentials.'

        Notify.create({
          type: 'negative',
          message: errorMessage,
          position: 'top'
        })
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
