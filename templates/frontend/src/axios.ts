import axios, { InternalAxiosRequestConfig } from 'axios';

/** Base URL — Vite proxy handles /api in dev; set VITE_API_URL for production */
const baseURL: string = import.meta.env.VITE_API_URL || '/';

export const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 10_000,
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
