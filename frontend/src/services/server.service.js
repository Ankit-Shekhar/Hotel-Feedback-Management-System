import api from './api'

export const checkServerHealth = async () => {
  const { data } = await api.get('/health')
  return Boolean(data?.success)
}
