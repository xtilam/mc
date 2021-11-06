import axiosClient from "./axios";

export const AuthApi = {
    login: (formData) => axiosClient.post('/auth/login', formData),
    register: (formData) => axiosClient.post('/auth/register', formData),
    emailVerification: (search) => axiosClient.get('/auth/verification' + search),
    logout: () => axiosClient.post('/auth/logout')
}