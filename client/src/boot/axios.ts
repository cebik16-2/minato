import { boot } from 'quasar/wrappers'
import axios, { type AxiosInstance } from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $api: AxiosInstance
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

// ✅ Automatically add Devise Token Auth headers from localStorage
api.interceptors.request.use((config) => {
  const authToken = localStorage.getItem('authToken')
  if (authToken) {
    try {
      const token = JSON.parse(authToken)
      config.headers['access-token'] = token['access-token']
      config.headers['client'] = token['client']
      config.headers['uid'] = token['uid']
    } catch (e) {
      console.warn('⚠️ Invalid authToken format in localStorage', e)
    }
  }
  return config
}, error => Promise.reject(new Error(error)))

// ✅ Automatically update token in localStorage after each response
api.interceptors.response.use((response) => {
  const newToken = {
    'access-token': response.headers['access-token'],
    client: response.headers['client'],
    uid: response.headers['uid']
  }

  if (newToken['access-token'] && newToken.client && newToken.uid) {
    localStorage.setItem('authToken', JSON.stringify(newToken))
  }

  return response
}, error => Promise.reject(new Error(error)))

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
