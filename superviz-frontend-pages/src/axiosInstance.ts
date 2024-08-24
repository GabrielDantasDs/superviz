import axios from 'axios';

// Create an instance of axios
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Use an environment variable for your API URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Modify the request config before it is sent
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);


// Interceptor de resposta
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                window.location.href = '/'; // Redireciona para a tela inicial
            }
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;
