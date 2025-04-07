<template>
  <q-dialog v-model="dialog" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Register</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="email"
          label="Email"
          type="email"
          filled
          class="q-mb-sm"
        />
        <q-input
          v-model="password"
          label="Password"
          type="password"
          filled
          class="q-mb-sm"
        />
        <q-input
          v-model="confirmPassword"
          label="Confirm Password"
          type="password"
          filled
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Register" color="primary" @click="handleRegister" />
        <q-btn flat label="Cancel" color="primary" @click="close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { register } from 'src/services/api/auth/authApi'

export default defineComponent({
  name: 'RegisterModal',
  emits: ['close'],
  setup(_, { emit }) {
    const dialog = ref(true)
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')

    const handleRegister = async () => {
      if (!email.value || !password.value || !confirmPassword.value) {
        alert('Please fill out all fields.')
        return
      }

      if (password.value !== confirmPassword.value) {
        alert('Passwords do not match.')
        return
      }

      try {
        await register({
          email: email.value,
          password: password.value,
          password_confirmation: confirmPassword.value
        })
        emit('close')
      } catch (err) {
        console.error('❌ Registration failed:', err)
        alert('Registration failed. Please try again.')
      }
    }

    const close = () => {
      dialog.value = false
      emit('close')
    }

    return {
      dialog,
      email,
      password,
      confirmPassword,
      handleRegister,
      close
    }
  }
})
</script>
