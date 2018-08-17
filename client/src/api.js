const axios = require('axios')

const API = axios.create({
  baseURL: 'http://api.burninghotfood.com'
})

export default (query, data = {}) => {
  return (API.post(query, data))
}
