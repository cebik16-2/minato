import { api } from '../../../boot/axios'

export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await api.post('/auth/sign_in', credentials)

    const headers = response.headers

    const authToken = {
      'access-token': headers['access-token'],
      client: headers['client'],
      uid: headers['uid']
    }

    if (authToken['access-token'] && authToken.client && authToken.uid) {
      localStorage.setItem('authToken', JSON.stringify(authToken))
    } else {
      console.warn('⚠️ Login succeeded but auth headers missing')
    }

    return response.data
  } catch (error) {
    console.error('❌ Login failed:', error)
    throw error
  }
}

export const logout = async () => {
  try {
    await api.delete('/auth/sign_out') // ✅ Fixed
  } finally {
    localStorage.removeItem('authToken')
  }
}

export const register = (user: { email: string; password: string; password_confirmation: string }) =>
  api.post('/auth', user) // ✅ Fixed

export const requestPasswordReset = (email: string) =>
  api.post('/auth/password', { email }) // ✅ Fixed

export const resetPassword = (data: { reset_token: string; password: string }) =>
  api.put('/auth/password', data) // ✅ Fixed
