import axios from 'axios';

export const axiosClient = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptors here (e.g., adding JWT token)
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('troller_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized (redirect to login, clear token)
            localStorage.removeItem('troller_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
