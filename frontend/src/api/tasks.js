import apiClient from "@/api/apiClient.js";

export default {
    getTask(listId, taskId) {
        return apiClient.get(`/api/lists/${listId}/tasks/${taskId}`);
    },
    createTask(listId, taskData) {
        return apiClient.post(`/api/lists/${listId}/tasks`, taskData);
    },
    updateTask(listId, taskId, taskData) {
        return apiClient.put(`/api/lists/${listId}/tasks/${taskId}`, taskData);
    },
    deleteTask(listId, taskId) {
        return apiClient.delete(`/api/lists/${listId}/tasks/${taskId}`);
    },
    getTaskStatuses() {
        return apiClient.get(`/api/task-statuses`);
    }
};