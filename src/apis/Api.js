import axios from "axios";
import axiosRetry from 'axios-retry';
import { toast } from 'react-toastify';
import jwt_decode from "jwt-decode";

const apiBaseUrl = process.env.REACT_APP_API_URL;
const tokenStorageKey = process.env.REACT_APP_TOKEN_STORAGE_KEY;
axiosRetry(axios, {
    retries: 3, retryDelay: (retryCount) => {
        return retryCount * 1000;
    }
});
export const Api = {
    "Post": (url, data) => {
        if (data) {
            return axios.post(apiBaseUrl + url, data, {
                headers: {
                    'Access-Control-Allow-Origin': "*"
                }
            });
        } else {
            throw new Error("Pass Data Object");
        }
    },
    "Put": (url, data, header) => {
        if (data) {
            header = header === undefined ? {} : header;
            header['Access-Control-Allow-Origin'] = "*";
            return axios.put(apiBaseUrl + url, data, {
                headers: header
            });
        } else {
            throw new Error("Pass Data Object");
        }
    },
    "FileUploadPut": (url, data) => {
        if (data) {
            return axios.put(apiBaseUrl + url, data, {
                headers: {
                    'Access-Control-Allow-Origin': "*",
                    'Content-Type': 'multipart/form-data'
                }
            });
        } else {
            throw new Error("Pass Data Object");
        }
    },
    "FileUploadPost": (url, data) => {
        if (data) {
            return axios.post(apiBaseUrl + url, data, {
                headers: {
                    'Access-Control-Allow-Origin': "*",
                    'Content-Type': 'multipart/form-data'
                }
            });
        } else {
            throw new Error("Pass Data Object");
        }
    },
    "Delete": (url) => {
        return axios.delete(apiBaseUrl + url, {
            headers: {
                'Access-Control-Allow-Origin': "*"
            }
        });
    },
    "Get": (url, useDefault) => {
        let head = useDefault !== undefined && useDefault !== null && !useDefault ? {} : {
            'Access-Control-Allow-Origin': "*"
        };
        return axios.get((useDefault !== undefined && useDefault !== null && !useDefault ? '' : apiBaseUrl) + url, {
            headers: head
        });
    },
    MultiCall: (promises) => { //Array of Promises
        return axios.all(promises);
    }
}

axios.interceptors.response.use(
    (res) => {
        //Hide Loader on api call completion
        document.body.classList.remove('loading-indicator');
        // Add configurations here
        if (res.status === 200) {
        }
        return res;
    },
    (err) => {
          //Hide Loader on api call completion
          document.body.classList.remove('loading-indicator');
        if (err.status === 500)
            toast.error('Something Went Wrong');

        if (err.response.status === 400) {
            toast.warn(err.response.data.Message)
        }
        return Promise.reject(err);
    }
);

axios.interceptors.request.use(
    (req) => {
        //Show Loader on api call
        document.body.classList.add('loading-indicator');

        var token = localStorage.getItem(tokenStorageKey);
        if (token === undefined || token === null)
            return req;

        token = JSON.parse(token);
        var header = req.headers;
        var tokenData = jwt_decode(token.accessToken);
        header['Authorization'] = `bearer ${token.accessToken}`;
        header['userId'] = tokenData.userId;
        req.headers = header;
        return req;
    }
)