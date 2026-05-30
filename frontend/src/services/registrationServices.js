import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`

export const registerApi = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData)
  return res.data
}
