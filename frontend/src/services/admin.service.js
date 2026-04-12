import api from './api'

export const loginAdmin = async (credentials) => {
  const { data } = await api.post('/admin/login', credentials)
  return data?.data ?? null
}

export const getDashboardStats = async () => {
  const { data } = await api.get('/admin/dashboard')
  return data?.data ?? { totalFeedbacks: 0, averageRatings: {} }
}

export const deleteFeedbacksBulk = async (feedbackIds = []) => {
  const { data } = await api.post('/admin/feedback/delete-bulk', { feedbackIds })
  return data?.data ?? { requested: 0, deleted: 0 }
}

export const deleteAllFeedbacks = async () => {
  const { data } = await api.post('/admin/feedback/delete-all')
  return data?.data ?? { deleted: 0 }
}

export const getDashboardSummary = getDashboardStats


