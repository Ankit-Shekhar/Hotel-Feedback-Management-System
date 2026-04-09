import api from './api'

export const getFeedbackByHotel = async (hotelId) => {
  const { data } = await api.get(`/feedback/hotel/${hotelId}`)
  return data?.data ?? { feedbacks: [], pagination: null }
}

export const submitFeedback = async (payload) => {
  const { data } = await api.post('/feedback', payload)
  return data?.data ?? null
}

export const createFeedback = submitFeedback

export const getRecentFeedbacks = async (limit = 10) => {
  const { data } = await api.get('/feedback/recent', { params: { limit } })
  return data?.data ?? []
}


