const axios = require('axios')

const API = axios.create({
  baseURL: 'http://18.222.253.201:8081'
})

export default (query, data = {}) => {
  return (API.post(query, data))
}
