import { defineStore } from 'pinia';
import authApi from '@/api/auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')),
        token: JSON.parse(localStorage.getItem('token')),
    }),
    actions: {
        async login(credentials) {
            try {
                const response = await authApi.login(credentials);

                this.user = response.data.data.user;
                this.token = response.data.data.access_token;
                localStorage.setItem('user', JSON.stringify(this.user));
                localStorage.setItem('token', JSON.stringify(this.token));

                return response;
            } catch (error) {
                throw error;
            }
        },
        async logout() {
            try {
                await authApi.logout();
                this.user = null;
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            } catch (error) {
                throw error;
            }
        },
        async register(userData) {
            try {
                const response = await authApi.register(userData);

                return response;
            } catch (error) {
                throw error;
            }
        }
    }
});