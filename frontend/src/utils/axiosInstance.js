import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

// Request Interceptor: Attach access token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") // Use "token" as that's what they were using previously
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401 and Refresh Token
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't retried yet
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to get a new token
                // NOTE: We use standard axios here to prevent infinite interceptor loops
                const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
                    withCredentials: true // Assuming refresh token is in HttpOnly cookie
                });

                const newToken = response.data.token; // Update based on what your backend sends

                if (newToken) {
                    localStorage.setItem("token", newToken);
                    
                    // Update header and retry original request
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                // If refresh fails, log out user
                console.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error)
    }
)

export default axiosInstance
