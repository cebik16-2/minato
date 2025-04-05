import { api } from '../../../boot/axios'

export const login = (credentials: { email: string; password: string }) =>
  api.post('/users/sign_in', { user: credentials })

export const logout = () =>
  api.delete('/users/sign_out')

export const register = (user: { email: string; password: string; password_confirmation: string }) =>
  api.post('/users', { user })

export const requestPasswordReset = (email: string) =>
  api.post('/users/password', { user: { email } })

export const resetPassword = (data: { reset_token: string; password: string }) =>
  api.put('/users/password', data)
