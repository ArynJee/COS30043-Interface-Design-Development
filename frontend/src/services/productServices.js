import axios from 'axios'

const BASE = `${import.meta.env.VITE_API_BASE_URL}/api/products`

export const getProductsApi = async (params = {}) => {
  const res = await axios.get(BASE, { params })
  return res.data
}

export const getFiltersApi = async () => {
  const res = await axios.get(`${BASE}/filters`)
  return res.data
}
