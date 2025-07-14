import apiClient from "@/api/apiClient.js";

export default {
    getBoards() {
        return apiClient.get('/api/boards');
    },
    getBoard(id) {
        return apiClient.get(`/api/boards/${id}`);
    },
    createBoard(boardData) {
        return apiClient.post(`/api/boards`, boardData);
    },
    updateBoard(id, boardData) {
        return apiClient.put(`/api/boards/${id}`, boardData);
    },
    deleteBoard(id) {
        return apiClient.delete(`/api/boards/${id}`);
    },
    getBoardLists(boardId) {
        return apiClient.get(`/api/boards/${boardId}/lists`);
    }
};