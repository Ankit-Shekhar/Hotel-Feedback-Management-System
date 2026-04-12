import api from './api'

export const loginAdmin = async (credentials) => {
  const { data } = await api.post('/admin/login', credentials)
  return data?.data ?? null
}

export const getDashboardStats = async () => {
  const { data } = await api.get('/admin/dashboard')
  return data?.data ?? { totalFeedbacks: 0, averageRatings: {} }
}

export const getDashboardSummary = getDashboardStats


