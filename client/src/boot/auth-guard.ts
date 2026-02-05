import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'src/stores/authStore'
import { storeToRefs } from 'pinia'

export default boot(({ router }) => {
  router.beforeEach((to, _, next) => {
    const authStore = useAuthStore()
    const { isAuthenticated } = storeToRefs(authStore)

    if (to.meta['requiresAuth'] && !isAuthenticated.value) {
        // Store the original path before showing the login modal
      authStore.openLoginModal(to.fullPath)
      next(false)
    } else {
      next()
    }
  })
})
