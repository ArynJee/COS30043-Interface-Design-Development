import axios from 'axios'

const BASE = 'http://localhost:3000/api/showcase'

export const getContributionsApi = async (area = 'All') => {
  const params = area !== 'All' ? { area } : {}
  const res = await axios.get(BASE, { params })
  return res.data
}
