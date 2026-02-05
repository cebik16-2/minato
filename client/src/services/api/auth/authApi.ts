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

    return response // ✅ Return full Axios response (not just response.data)
  } catch (error) {
    console.error('❌ Login failed:', error)
    throw error
  }
}

export const logout = async () => {
  try {
    await api.delete('/auth/sign_out')
  } finally {
    localStorage.removeItem('authToken')
  }
}

export const register = (user: {
  email: string
  password: string
  password_confirmation: string
}) => {
  return api.post('/auth', {
    email: user.email,
    password: user.password,
    password_confirmation: user.password_confirmation,
    confirm_success_url: 'http://localhost:9000/auth/callback'
  })
}

export const requestPasswordReset = async (email: string) => {
  try {
    await api.post('/auth/password', {
      email,
      redirect_url: 'http://localhost:9000/reset'
    })
  } catch (error) {
    console.error('❌ Password reset request failed:', error)
    throw error
  }
}

export const resetPassword = async (data: {
  password: string
  password_confirmation: string
  reset_password_token: string
}) => {
  try {
    await api.put('/auth/password', data)
  } catch (error) {
    console.error('❌ Password reset failed:', error)
    throw error
  }
}
