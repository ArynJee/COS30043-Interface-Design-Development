import axios from 'axios'

const API_URL = 'http://localhost:3000/api/auth'

export const loginApi = async (credentials) => {
  const res = await axios.post(`${API_URL}/login`, credentials)
  return res.data
}

export const sendOtpApi = async (email) => {
  const res = await axios.post(`${API_URL}/forgot-password`, { email })
  return res.data
}

export const verifyOtpApi = async (email, otp) => {
  const res = await axios.post(`${API_URL}/verify-otp`, { email, otp })
  return res.data
}

export const resetPasswordApi = async (email, otp, password) => {
  const res = await axios.post(`${API_URL}/reset-password`, { email, otp, password })
  return res.data
}
