const axios = require('axios')

const API = axios.create({
  baseURL: 'http://172.31.32.52:8081'
})

export default (query, data = {}) => {
  return (API.post(query, data))
}
