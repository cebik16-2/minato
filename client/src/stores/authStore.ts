import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'

export const useAuthStore = defineStore('auth', () => {
  const storedToken = localStorage.getItem('authToken')
  const isAuthenticated = ref(!!storedToken)
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

  const login = (token: {
    'access-token': string
    client: string
    uid: string
  }) => {
    localStorage.setItem('authToken', JSON.stringify(token))

    api.defaults.headers.common['access-token'] = token['access-token']
    api.defaults.headers.common['client'] = token.client
    api.defaults.headers.common['uid'] = token.uid

    isAuthenticated.value = true
    closeLoginModal()
  }

  const logout = () => {
    localStorage.removeItem('authToken')

    delete api.defaults.headers.common['access-token']
    delete api.defaults.headers.common['client']
    delete api.defaults.headers.common['uid']

    isAuthenticated.value = false
  }

  // Restore auth headers on startup if available
  if (storedToken) {
    try {
      const parsed = JSON.parse(storedToken)
      api.defaults.headers.common['access-token'] = parsed['access-token']
      api.defaults.headers.common['client'] = parsed.client
      api.defaults.headers.common['uid'] = parsed.uid
    } catch {
      console.warn('Invalid auth token in localStorage, clearing it.')
      localStorage.removeItem('authToken')
    }
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
