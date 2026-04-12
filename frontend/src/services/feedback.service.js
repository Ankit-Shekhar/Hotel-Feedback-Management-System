import api from './api'

export const submitFeedback = async (payload) => {
  const { data } = await api.post('/feedback/global', payload)
  return data?.data ?? null
}

export const createFeedback = submitFeedback

export const getRecentFeedbacks = async (limit = 10) => {
  const { data } = await api.get('/feedback/recent', { params: { limit } })
  return data?.data ?? []
}


