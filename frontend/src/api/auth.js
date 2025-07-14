import apiClient from "@/api/apiClient.js";

export default {
    login(credentials) {
        return apiClient.post('/api/login', credentials);
    },
    logout() {
        return apiClient.post('/api/logout');
    },
    register(userData) {
        return apiClient.post('/api/register', userData);
    }
};