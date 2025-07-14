import { defineStore } from 'pinia';
import boardsApi from '@/api/boards';
import listsApi from '@/api/lists';
import tasksApi from '@/api/tasks';

export const useBoardsStore = defineStore('boards', {
    state: () => ({
        boards: [],
        currentBoard: null,
        lists: [],
        tasks: []
    }),
    actions: {
        async fetchBoards() {
            try {
                const response = await boardsApi.getBoards();
                console.log("b", response);
                this.boards = response.data;
                return response;
            } catch (error) {
                throw error;
            }
        },
        async fetchBoard(id) {
            try {
                const response = await boardsApi.getBoard(id);
                this.currentBoard = response.data;
                return response;
            } catch (error) {
                throw error;
            }
        },
        async createBoard(boardData) {
            try {
                const response = await boardsApi.createBoard(boardData);
                this.boards.push(response.data);
                return response;
            } catch (error) {
                throw error;
            }
        },
        async updateBoard(id, boardData) {
            try {
                const response = await boardsApi.updateBoard(id, boardData);
                const index = this.boards.findIndex(board => board.id === id);
                if (index !== -1) {
                    this.boards[index] = response.data;
                }
                return response;
            } catch (error) {
                throw error;
            }
        },
        async deleteBoard(id) {
            try {
                await boardsApi.deleteBoard(id);
                this.boards = this.boards.filter(board => board.id !== id);
            } catch (error) {
                throw error;
            }
        },
        async fetchBoardLists(boardId) {
            try {
                const response = await boardsApi.getBoardLists(boardId);
                this.lists = response.data;
                return response;
            } catch (error) {
                throw error;
            }
        },
        async createList(boardId, listData) {
            try {
                const response = await listsApi.createList(boardId, listData);
                this.lists.push(response.data);
                return response;
            } catch (error) {
                throw error;
            }
        },
        async updateList(boardId, listId, listData) {
            try {
                const response = await listsApi.updateList(boardId, listId, listData);
                const index = this.lists.findIndex(list => list.id === listId);
                if (index !== -1) {
                    this.lists[index] = response.data;
                }
                return response;
            } catch (error) {
                throw error;
            }
        },
        async deleteList(boardId, listId) {
            try {
                await listsApi.deleteList(boardId, listId);
                this.lists = this.lists.filter(list => list.id !== listId);
            } catch (error) {
                throw error;
            }
        },
        async fetchListTasks(listId) {
            try {
                const response = await listsApi.getListTasks(listId);
                this.tasks = response.data;
                return response;
            } catch (error) {
                throw error;
            }
        },
        async createTask(listId, taskData) {
            try {
                const response = await tasksApi.createTask(listId, taskData);
                this.tasks.push(response.data);
                return response;
            } catch (error) {
                throw error;
            }
        },
        async updateTask(listId, taskId, taskData) {
            try {
                const response = await tasksApi.updateTask(listId, taskId, taskData);
                const index = this.tasks.findIndex(task => task.id === taskId);
                if (index !== -1) {
                    this.tasks[index] = response.data;
                }
                return response;
            } catch (error) {
                throw error;
            }
        },
        async deleteTask(listId, taskId) {
            try {
                await tasksApi.deleteTask(listId, taskId);
                this.tasks = this.tasks.filter(task => task.id !== taskId);
            } catch (error) {
                throw error;
            }
        }
    }
});