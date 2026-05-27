import axios from 'axios'

const BASE = 'http://localhost:3000/api/products'

export const getProductsApi = async (params = {}) => {
  const res = await axios.get(BASE, { params })
  return res.data
}

export const getFiltersApi = async () => {
  const res = await axios.get(`${BASE}/filters`)
  return res.data
}
