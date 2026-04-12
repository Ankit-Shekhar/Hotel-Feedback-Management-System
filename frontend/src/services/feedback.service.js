import api from './api'

const SUBMIT_TIMEOUT_MS = 45000

const wait = (ms) => new Promise((resolve) => {
  window.setTimeout(resolve, ms)
})

const isRetryableError = (error) => {
  if (!error?.response) {
    return true
  }

  if (error?.code === 'ECONNABORTED') {
    return true
  }

  return (error.response.status || 0) >= 500
}

export const submitFeedback = async (payload) => {
  try {
    const { data } = await api.post('/feedback/global', payload, { timeout: SUBMIT_TIMEOUT_MS })
    return data?.data ?? null
  } catch (error) {
    // Compatibility with deployments where /feedback/global isn't available yet.
    if (error?.response?.status === 404) {
      const { data } = await api.post('/feedback', payload, { timeout: SUBMIT_TIMEOUT_MS })
      return data?.data ?? null
    }

    if (isRetryableError(error)) {
      await wait(1500)
      const { data } = await api.post('/feedback/global', payload, { timeout: SUBMIT_TIMEOUT_MS })
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


