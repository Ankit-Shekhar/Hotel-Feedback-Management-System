import api from './api'

export const getHotels = async (params = {}) => {
  const { data } = await api.get('/hotels', { params })
  return data?.data ?? []
}

export const addHotel = async (payload) => {
  const { data } = await api.post('/hotels', payload)
  return data?.data ?? null
}

export const updateHotel = async (hotelId, payload) => {
  const { data } = await api.patch(`/hotels/${hotelId}`, payload)
  return data?.data ?? null
}

export const getHotelById = async (hotelId) => {
  const { data } = await api.get(`/hotels/${hotelId}`)
  return data?.data ?? null
}

export const getAllHotels = getHotels


