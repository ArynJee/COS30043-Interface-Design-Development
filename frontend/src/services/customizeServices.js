import axios from 'axios'

const BASE_CART     = 'http://localhost:3000/api/cart'
const BASE_SHOWCASE = 'http://localhost:3000/api/showcase'

function authHeader() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const addToCartApi = async ({ furniture_type, skeleton_type, configuration, unit_price, preview_image }) => {
  const res = await axios.post(
    BASE_CART,
    { furniture_type, skeleton_type, configuration, unit_price, preview_image },
    { headers: authHeader() }
  )
  return res.data
}

export const contributeDesignApi = async ({ area, furniture_type, description, configuration, total_cost, preview_image }) => {
  const res = await axios.post(
    BASE_SHOWCASE,
    { area, furniture_type, description, configuration, total_cost, preview_image },
    { headers: authHeader() }
  )
  return res.data
}
