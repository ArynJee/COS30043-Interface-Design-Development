import axios from 'axios'

const BASE = 'http://localhost:3000/api/showcase'

function authHeader() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getContributionsApi = async (area = 'All') => {
  const params = area !== 'All' ? { area } : {}
  const res = await axios.get(BASE, { params })
  return res.data
}

export const getContributionApi = async (id) => {
  const res = await axios.get(`${BASE}/${id}`)
  return res.data
}

export const getContributionReviewsApi = async (id) => {
  const res = await axios.get(`${BASE}/${id}/reviews`)
  return res.data
}

export const addContributionReviewApi = async (id, { rating, comment }) => {
  const res = await axios.post(
    `${BASE}/${id}/reviews`,
    { rating, comment },
    { headers: authHeader() }
  )
  return res.data
}
