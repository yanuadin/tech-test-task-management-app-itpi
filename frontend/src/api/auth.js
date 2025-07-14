import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api';

export default {
    login(credentials) {
        return axios.post(`${baseURL}/login`, credentials);
    },
    logout() {
        return axios.post(`${baseURL}/logout`);
    },
    register(userData) {
        return axios.post(`${baseURL}/register`, userData);
    }
};