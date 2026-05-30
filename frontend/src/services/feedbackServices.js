import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/feedback`

export const getFeedbacksApi = async () => {
  const res = await axios.get(API_URL)
  return res.data
}

export const createFeedbackApi = async (feedbackData) => {
  const res = await axios.post(API_URL, feedbackData)
  return res.data
}