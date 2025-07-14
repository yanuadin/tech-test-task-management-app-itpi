import axios from 'axios';

const baseURL = '/api';

export default {
    getList(boardId, listId) {
        return axios.get(`${baseURL}/boards/${boardId}/lists/${listId}`);
    },
    createList(boardId, listData) {
        return axios.post(`${baseURL}/boards/${boardId}/lists`, listData);
    },
    updateList(boardId, listId, listData) {
        return axios.put(`${baseURL}/boards/${boardId}/lists/${listId}`, listData);
    },
    deleteList(boardId, listId) {
        return axios.delete(`${baseURL}/boards/${boardId}/lists/${listId}`);
    },
    getListTasks(listId) {
        return axios.get(`${baseURL}/lists/${listId}/tasks`);
    }
};