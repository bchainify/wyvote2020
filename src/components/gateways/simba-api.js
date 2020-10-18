import axios from 'axios'

const HTTP = axios.create({
  baseURL: 'https://api.simbachain.com/v1/election2020/',
  headers: {
    APIKEY: '3998d4f3a8ed18dc4a51f7571d8615e027046a1874c94061320ce981a0efe618'
  }
})

export default {
  getData (name) {
    HTTP.defaults.headers.common['Content-Type'] = 'multipart/form-data'
    return HTTP.get(name)
  },
  postData (name, data) {
    HTTP.defaults.headers.common['Content-Type'] = 'multipart/form-data'
    return HTTP.post(name, data)
  },
  signTxn (name, data) {
    HTTP.defaults.headers.common['Content-Type'] = 'application/json'
    return HTTP.post(name, data)
  }
}
