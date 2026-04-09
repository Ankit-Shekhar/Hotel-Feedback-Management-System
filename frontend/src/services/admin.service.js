import api from './api'

export const loginAdmin = async (credentials) => {
  const { data } = await api.post('/admin/login', credentials)
  return data
}

export const getDashboardSummary = async () => {
  const { data } = await api.get('/admin/dashboard')
  return data
}
