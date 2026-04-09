import api from './api'

export const getFeedbackByHotel = async (hotelId) => {
  const { data } = await api.get(`/feedback/hotel/${hotelId}`)
  return data
}

export const createFeedback = async (payload) => {
  const { data } = await api.post('/feedback', payload)
  return data
}
