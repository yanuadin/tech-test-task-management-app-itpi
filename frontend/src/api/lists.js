import apiClient from "@/api/apiClient.js";

export default {
    getList(boardId, listId) {
        return apiClient.get(`/api/boards/${boardId}/lists/${listId}`);
    },
    createList(boardId, listData) {
        return apiClient.post(`/api/boards/${boardId}/lists`, listData);
    },
    updateList(boardId, listId, listData) {
        return apiClient.put(`/api/boards/${boardId}/lists/${listId}`, listData);
    },
    deleteList(boardId, listId) {
        return apiClient.delete(`/api/boards/${boardId}/lists/${listId}`);
    },
    getListTasks(listId) {
        return apiClient.get(`/api/lists/${listId}/tasks`);
    }
};