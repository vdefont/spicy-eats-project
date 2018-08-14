const axios = require('axios')

const API = axios.create({
  baseURL: 'http://127.0.0.1:8081'
})

export default (query, data = {}) => {
  return (API.post(query, data))
}
