<template>
  <div class="q-pa-md">
    <q-card flat bordered class="profile-card">
      <q-card-section>
        <div class="text-h6 flex items-center">
          <q-icon name="account_circle" size="md" class="q-mr-sm" />
          Your Profile
        </div>
        <q-separator spaced />

        <div class="q-mt-md text-body1">
          <div><strong>Email:</strong> {{ email || 'N/A' }}</div>
        </div>

        <!-- Future Enhancements -->
        <!-- <div class="q-mt-sm text-caption text-grey">
          Add more profile details like name, role, joined date, etc.
        </div> -->

        <div class="q-mt-lg">
          <q-btn
            label="Logout"
            color="negative"
            icon="logout"
            @click="handleLogout"
            unelevated
            class="full-width"
          />
        </div>
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
        try {
          const parsed = JSON.parse(authToken)
          email.value = parsed?.uid || null
        } catch (e) {
          console.warn('Invalid token format', e)
          email.value = null
        }
      }
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
      email,
      handleLogout
    }
  }
}
</script>

<style scoped>
.profile-card {
  max-width: 400px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style>
