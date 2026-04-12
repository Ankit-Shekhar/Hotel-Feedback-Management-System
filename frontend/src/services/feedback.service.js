import api from './api'

export const submitFeedback = async (payload) => {
  try {
    const { data } = await api.post('/feedback/global', payload)
    return data?.data ?? null
  } catch (error) {
    // Backward compatibility with older backend deployments that only expose /feedback
    if (error?.response?.status === 404) {
      const { data } = await api.post('/feedback', payload)
      return data?.data ?? null
    }

    throw error
  }
}

export const createFeedback = submitFeedback

export const getRecentFeedbacks = async (limit = 10) => {
  const { data } = await api.get('/feedback/recent', { params: { limit } })
  return data?.data ?? []
}


