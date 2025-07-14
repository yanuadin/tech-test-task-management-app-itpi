import axios from 'axios';

const baseURL = '/api';

export default {
    getTask(listId, taskId) {
        return axios.get(`${baseURL}/lists/${listId}/tasks/${taskId}`);
    },
    createTask(listId, taskData) {
        return axios.post(`${baseURL}/lists/${listId}/tasks`, taskData);
    },
    updateTask(listId, taskId, taskData) {
        return axios.put(`${baseURL}/lists/${listId}/tasks/${taskId}`, taskData);
    },
    deleteTask(listId, taskId) {
        return axios.delete(`${baseURL}/lists/${listId}/tasks/${taskId}`);
    },
    getTaskStatuses() {
        return axios.get(`${baseURL}/task-statuses`);
    }
};