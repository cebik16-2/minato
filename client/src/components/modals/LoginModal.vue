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

        const token = response?.data?.token
        if (token) {
          authStore.login(token)
          Notify.create({
            type: 'positive',
            message: 'Login successful!',
            position: 'top'
          })

          if (authStore.redirectAfterLogin) {
            await router.push(authStore.redirectAfterLogin)
            authStore.redirectAfterLogin = null
          }
        } else {
          throw new Error('No token returned from API')
        }
      } catch (err: unknown) {
        console.error('❌ Login failed:', err)

        const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message

        Notify.create({
          type: 'negative',
          message: errorMessage || 'Login failed. Please check your credentials.',
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
