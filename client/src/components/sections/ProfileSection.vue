<template>
  <div class="q-pa-md">
    <q-card flat bordered class="q-pa-md">
      <q-card-section>
        <div class="text-h6">👤 Your Profile</div>
        <q-separator spaced />
        <div class="q-mt-md">
          <div><strong>Email:</strong> {{ email || 'N/A' }}</div>
        </div>
        <q-btn
          label="Logout"
          color="negative"
          class="q-mt-lg"
          @click="handleLogout"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { logout } from 'src/services/api/auth/authApi'
import { useRouter } from 'vue-router'

export default {
  name: 'ProfileSection',
  setup() {
    const email = ref<string | null>(null)
    const router = useRouter()

    onMounted(() => {
      const authToken = localStorage.getItem('authToken')
      if (authToken) {
        const parsed = JSON.parse(authToken)
        email.value = parsed.uid || null
      }
    })

    const handleLogout = async () => {
      try {
        await logout()
        localStorage.removeItem('authToken')
        void router.push('/') // Redirect to home or login
      } catch (err) {
        console.error('Logout failed:', err)
      }
    }

    return {
      email,
      handleLogout
    }
  }
}
</script>
