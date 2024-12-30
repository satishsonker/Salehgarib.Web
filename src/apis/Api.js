import axios from "axios";
import axiosRetry from 'axios-retry';
import { toast } from 'react-toastify';
import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const apiBaseUrl = process.env.REACT_APP_API_URL;
const tokenStorageKey = process.env.REACT_APP_TOKEN_STORAGE_KEY;

// Retry logic with axios
axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryCount) => retryCount * 1000 // exponential backoff
});

// Create a single Axios instance
const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        'Access-Control-Allow-Origin': "*",
        'Accept': 'application/json'
    }
});

// Request interceptor
axiosInstance.interceptors.request.use((req) => {
    document.body.classList.add('loading-indicator'); // Show loader
    const accessToken = cookies.get(process.env.REACT_APP_ACCESS_STORAGE_KEY);
    const loginToken = JSON.parse(localStorage.getItem(process.env.REACT_APP_TOKEN_STORAGE_KEY));

    if (accessToken && loginToken) {
        const decodedToken = jwt_decode(accessToken);
        req.headers['Authorization'] = `Bearer ${loginToken?.accessToken}`;
        req.headers['userId'] = decodedToken.employeeId;
    }
    return req;
});

// Response interceptor
axiosInstance.interceptors.response.use(
    (res) => {
        document.body.classList.remove('loading-indicator'); // Hide loader
        return res;
    },
    (err) => {
        document.body.classList.remove('loading-indicator'); // Hide loader on error
        if (err.response?.status === 500) {
            toast.error('Something Went Wrong');
        } else if (err.response?.status === 400) {
            toast.warn(err.response.data.Message);
        }
        return Promise.reject(err);
    }
);

// Api Object
export const Api = {
    Post: (url, data) => {
        if (!data) return Promise.reject(new Error("Pass Data Object"));
        return axiosInstance.post(url, data);
    },
    Put: (url, data, customHeaders = {}) => {
        if (!data) return Promise.reject(new Error("Pass Data Object"));
        return axiosInstance.put(url, data, { headers: customHeaders });
    },
    FileUploadPut: (url, data) => {
        if (!data) return Promise.reject(new Error("Pass Data Object"));
        return axiosInstance.put(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    FileUploadPost: (url, data) => {
        if (!data) return Promise.reject(new Error("Pass Data Object"));
        return axiosInstance.post(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    Delete: (url) => axiosInstance.delete(url),
    
    // Normal GET request without debounce (for parallel calls)
    Get: (url, useDefault = true) => {
        const fullUrl = (useDefault ? apiBaseUrl : '') + url;
        return axiosInstance.get(fullUrl);
    },

    MultiCall: (promises) => axios.all(promises) // Handles multiple calls at once
};