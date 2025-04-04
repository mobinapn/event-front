import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// Create an axios instance
const api = axios.create({ baseURL: 'https://web-production-d8f31.up.railway.app' })

// 1) Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Grab your token (for example, from localStorage)
    const token = localStorage.getItem('token')

    // If a token exists, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // If the request itself throws an error, just reject
    return Promise.reject(error)
  }
)

export default defineBoot(({ app }) => {
  // Make axios and api available in your Vue components via this.$axios / this.$api
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
