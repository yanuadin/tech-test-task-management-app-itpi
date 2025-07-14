import axios from 'axios'

// Create axios instance
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
    withCredentials: true, // Required for Laravel Sanctum
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
})

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') // Or use your preferred storage
        if (token) {
            const cleanToken = token.replace(/^"(.*)"$/, '$1')
            config.headers.Authorization = `Bearer ${cleanToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default apiClient