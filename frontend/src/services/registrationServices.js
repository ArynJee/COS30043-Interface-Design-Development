import axios from 'axios'

const API_URL = 'http://localhost:3000/api/auth'

export const registerApi = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData)
  return res.data
}
