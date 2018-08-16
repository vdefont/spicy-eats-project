const axios = require('axios')

const API = axios.create({
  baseURL: 'https://burninghotfood.com/api'
})

export default (query, data = {}) => {
  return (API.post(query, data))
}
