import { createApp } from 'vue'
import App from './App.vue'

// Quasar & plugins
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'

// Pinia (store)
import pinia from './stores'

// Router
import router from './router'

// Mount the app
const app = createApp(App)

app.use(Quasar, quasarUserOptions) // Quasar
app.use(pinia)                     // ✅ Pinia MUST come before router
app.use(router)                    // ✅ Router must come after pinia

app.mount('#q-app')                // ✅ Quasar injects this via <!-- quasar:entry-point -->
