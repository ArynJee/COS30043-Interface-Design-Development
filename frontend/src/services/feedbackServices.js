import axios from 'axios'

const API_URL = 'http://localhost:3000/api/feedback'

export const getFeedbacksApi = async () => {
  const res = await axios.get(API_URL)
  return res.data
}

export const createFeedbackApi = async (feedbackData) => {
  const res = await axios.post(API_URL, feedbackData)
  return res.data
}