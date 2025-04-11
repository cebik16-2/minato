import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(!!localStorage.getItem('authToken'))
  const showLoginModal = ref(false)
  const redirectAfterLogin = ref<string | null>(null)

  const openLoginModal = (redirectPath?: string) => {
    if (redirectPath) {
      redirectAfterLogin.value = redirectPath
    }
    showLoginModal.value = true
  }

  const closeLoginModal = () => {
    showLoginModal.value = false
  }

  // We’ll remove useRouter from here and handle redirect from the caller instead
  const login = (token: string) => {
    localStorage.setItem('authToken', token)
    isAuthenticated.value = true
    closeLoginModal()
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    isAuthenticated.value = false
  }

  return {
    isAuthenticated,
    showLoginModal,
    redirectAfterLogin,
    openLoginModal,
    closeLoginModal,
    login,
    logout
  }
})
