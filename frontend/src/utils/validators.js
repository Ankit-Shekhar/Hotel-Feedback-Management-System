export const isValidEmail = (value = '') => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export const isRatingValid = (rating) => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5
}
