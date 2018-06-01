import axios from 'axios'

const SERVER = axios.create({
  baseURL: 'http://localhost:8000'
  // baseURL: 'http://192.1.11.63:8000/task'
  // timeout: 2500
})

SERVER.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})

function setToken (AUTH_TOKEN) {
  SERVER.defaults.headers.common['Authorization'] = AUTH_TOKEN
  SERVER.defaults.headers.common['Time-Zone'] = 'Asia/Shanghai'
}

export {SERVER, setToken}
