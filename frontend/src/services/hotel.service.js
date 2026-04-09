import api from './api'

export const getHotels = async (params = {}) => {
  const { data } = await api.get('/hotels', { params })
  return data
}

export const getHotelById = async (hotelId) => {
  const { data } = await api.get(`/hotels/${hotelId}`)
  return data
}
