const axios = require('axios')

const API = axios.create({
  baseURL: 'http://api.burninghotfood.com',
  headers: {
    'X-Requested-With' : 'XMLHttpRequest'
  }
})

export default (query, data = {}) => {
  return (API.post(query, data))
}
