//@ts-nocheck
//@ts-ignore

import axios from 'axios';
import queryString from 'query-string';
import { storage } from '../common/storage';
import { env } from '../config/env';

const axiosClient = axios.create({
    baseURL: env.apiURL,
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
    config.headers = {
        ...config.headers,
        Authorization: storage.get(env.userToken)
    }
    return config;
})

axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;
}, (error) => {
    const response = error.response
    if (response && response.data) {
        throw { ...response.data, status: response.status };
    }
    throw response;
});

export default axiosClient;