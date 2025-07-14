import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const baseURL = 'http://127.0.0.1:8000/api';
const authStore = useAuthStore();

export default {
    getBoards() {
        return axios.get(`${baseURL}/boards`, {
            headers: {
                Authorization: `Bearer ${authStore.user.}`
            }
        });
    },
    getBoard(id) {
        return axios.get(`${baseURL}/boards/${id}`);
    },
    createBoard(boardData) {
        return axios.post(`${baseURL}/boards`, boardData);
    },
    updateBoard(id, boardData) {
        return axios.put(`${baseURL}/boards/${id}`, boardData);
    },
    deleteBoard(id) {
        return axios.delete(`${baseURL}/boards/${id}`);
    },
    getBoardLists(boardId) {
        return axios.get(`${baseURL}/boards/${boardId}/lists`);
    }
};