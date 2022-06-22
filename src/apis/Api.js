import axios from "axios";
import axiosRetry from 'axios-retry';
import {toast} from 'react-toastify';

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
    "Put": (url, data) => {
        if (data) {
            return axios.put(apiBaseUrl + url, data, {
                headers: {
                    'Access-Control-Allow-Origin': "*"
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
        // Add configurations here
        if (res.status === 200) {
            //console.log('Posted Successfully');
        }
        return res;
    },
    (err) => {
        if (err.status === 500)
            toast.error('somethingWentWrong');
        return Promise.reject(err);
    }
);

axios.interceptors.request.use(
    (req) => {
        var token = localStorage.getItem(tokenStorageKey);
        if (token === undefined || token === null)
            return req;

        token = JSON.parse(token);
        var header = req.headers;
        header['Authorization'] = `bearer ${token.accessToken}`;
        req.headers = header;
        return req;
    }
)