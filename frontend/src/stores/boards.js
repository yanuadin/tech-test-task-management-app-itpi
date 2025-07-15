import { defineStore } from 'pinia';
import boardsApi from '@/api/boards';
import listsApi from '@/api/lists';
import tasksApi from '@/api/tasks';

export const useBoardsStore = defineStore('boards', {
    state: () => ({
        boards: [],
        currentBoard: null,
        lists: [],
        tasks: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchBoards() {
            try {
                this.loading = true;
                const response = await boardsApi.getBoards();
                this.boards = response.data.data;

                return response.data.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch boards';
            } finally {
                this.loading = false;
            }
        },
        async fetchBoard(id) {
            try {
                this.loading = true;
                const response = await boardsApi.getBoard(id);
                this.currentBoard = response.data.data;
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch boards';
            } finally {
                this.loading = false;
            }
        },
        async createBoard(boardData) {
            try {
                this.loading = true;
                const response = await boardsApi.createBoard(boardData);
                this.boards.push(response.data.data);
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch boards';
            } finally {
                this.loading = false;
            }
        },
        async updateBoard(id, boardData) {
            try {
                this.loading = true;
                const response = await boardsApi.updateBoard(id, boardData);
                const index = this.boards.findIndex(board => board.id === id);
                if (index !== -1) {
                    this.boards[index] = response.data.data;
                }
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch boards';
            } finally {
                this.loading = false;
            }
        },
        async deleteBoard(id) {
            try {
                this.loading = true;
                await boardsApi.deleteBoard(id);
                this.boards = this.boards.filter(board => board.id !== id);
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch boards';
            } finally {
                this.loading = false;
            }
        },
        async fetchBoardLists(boardId) {
            try {
                this.loading = true;
                const response = await boardsApi.getBoardLists(boardId);
                this.lists = response.data.data

                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch boards';
            } finally {
                this.loading = false;
            }
        },
        async createList(boardId, listData) {
            try {
                this.loading = true;
                const response = await listsApi.createList(boardId, listData);
                this.lists.push(response.data.data);
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch boards';
            } finally {
                this.loading = false;
            }
        },
        async updateList(boardId, listId, listData) {
            try {
                this.loading = true;
                const response = await listsApi.updateList(boardId, listId, listData);
                const index = this.lists.findIndex(list => list.id === listId);
                if (index !== -1) {
                    this.lists[index] = response.data.data;
                }
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch boards';
            } finally {
                this.loading = false;
            }
        },
        async deleteList(boardId, listId) {
            try {
                this.loading = true;
                await listsApi.deleteList(boardId, listId);
                this.lists = this.lists.filter(list => list.id !== listId);
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch boards';
            } finally {
                this.loading = false;
            }
        },
        async fetchListTasks(listId) {
            try {
                this.loading = true;
                const response = await listsApi.getListTasks(listId);
                this.tasks = response.data.data;
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch boards';
            } finally {
                this.loading = false;
            }
        },
        async fetchAllTasks() {
            try {
                this.loading = true;
                const response = await tasksApi.getAllTask();
                this.tasks = response.data.data.data;
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch boards';
            } finally {
                this.loading = false;
            }
        },
        async createTask(listId, taskData) {
            try {
                this.loading = true;
                const response = await tasksApi.createTask(listId, taskData);
                this.tasks.push(response.data.data);
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch boards';
            } finally {
                this.loading = false;
            }
        },
        async updateTask(listId, taskId, taskData) {
            try {
                this.loading = true;
                const response = await tasksApi.updateTask(listId, taskId, taskData);
                const index = this.tasks.findIndex(task => task.id === taskId);
                if (index !== -1) {
                    this.tasks[index] = response.data.data;
                }
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch boards';
            } finally {
                this.loading = false;
            }
        },
        async deleteTask(listId, taskId) {
            try {
                this.loading = true;
                await tasksApi.deleteTask(listId, taskId);
                this.tasks = this.tasks.filter(task => task.id !== taskId);
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch boards';
            } finally {
                this.loading = false;
            }
        }
    }
});