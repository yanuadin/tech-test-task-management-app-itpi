<template>
  <div v-if="loading" class="flex justify-center items-center h-screen">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>

  <div v-else class="board-container">
    <div class="board-header bg-gray-100 p-4 shadow">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">{{ board?.title ?? "asd" }}</h1>
      </div>
    </div>

    <div class="board-content p-4 overflow-x-auto h-full">
      <div class="flex space-x-4 min-w-max">
        <BoardList
            v-for="list in lists"
            :key="list.id"
            :list="list"
            :on-task-added="refreshTasks"
            @update-list="handleUpdateList"
            @delete-list="handleDeleteList"
            @create-task="handleCreateTask"
            @update-task="handleUpdateTask"
            @delete-task="handleDeleteTask"
        />

        <div class="w-72 flex-shrink-0">
          <button
              @click="openCreateListModal"
              class="w-full bg-gray-200 hover:bg-gray-300 rounded-lg p-2 text-gray-700 flex items-center justify-center"
          >
            <span class="mr-2">+</span> Add another list
          </button>
        </div>
      </div>
    </div>

    <Modal :isOpen="isCreateListModalOpen" @close="closeCreateListModal">
      <template #title>Create New List</template>
      <template #content>
        <form @submit.prevent="handleCreateList">
          <div class="mb-4">
            <label for="listTitle" class="block text-gray-700 text-sm font-bold mb-2">List Title</label>
            <input
                v-model="newList.title"
                type="text"
                id="listTitle"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            >
          </div>
        </form>
      </template>
      <template #footer>
        <button
            type="button"
            @click="handleCreateList"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            :disabled="loading"
        >
          <span v-if="loading">Creating...</span>
          <span v-else>Create List</span>
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useBoardsStore } from "@/stores/boards.js";
import BoardList from '../components/BoardList.vue';
import Modal from '../components/Modal.vue';

const route = useRoute();
const boardStore = useBoardsStore();

const board = computed(() => boardStore.currentBoard);
const lists = computed(() => boardStore.lists);
const loading = computed(() => boardStore.loading);

const isCreateListModalOpen = ref(false);
const newList = ref({
  title: '',
  board_id: route.params.id
});

onMounted(async () => {
  await loadBoardData();
});

watch(() => route.params.id, async () => {
  await loadBoardData();
});

const loadBoardData = async () => {
  const boardId = route.params.id;
  await boardStore.fetchBoard(boardId);
  await boardStore.fetchBoardLists(boardId);
};

const refreshTasks = async () => {
  await boardStore.fetchBoardLists(route.params.id);
};

const openCreateListModal = () => {
  isCreateListModalOpen.value = true;
};

const closeCreateListModal = () => {
  isCreateListModalOpen.value = false;
  newList.value = { title: '', board_id: route.params.id };
};

const handleCreateList = async () => {
  try {
    await boardStore.createList(route.params.id, newList.value);
    closeCreateListModal();
  } catch (error) {
    console.error('Error creating list:', error);
  }
};

const handleUpdateList = async (listId, updatedData) => {
  try {
    await boardStore.updateList(route.params.id, listId, updatedData);
  } catch (error) {
    console.error('Error updating list:', error);
  }
};

const handleDeleteList = async (listId) => {
  try {
    await boardStore.deleteList(route.params.id, listId);
  } catch (error) {
    console.error('Error deleting list:', error);
  }
};

const handleCreateTask = async (listId, taskData) => {
  try {
    await boardStore.createTask(listId, taskData);
    await refreshTasks(); // Alternative: refresh here instead of in BoardList
  } catch (error) {
    console.error('Error creating task:', error);
  }
};

const handleUpdateTask = async (listId, taskId, updatedData) => {
  try {
    await boardStore.updateTask(listId, taskId, updatedData);
    await refreshTasks();
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

const handleDeleteTask = async (listId, taskId) => {
  try {
    await boardStore.deleteTask(listId, taskId);
    await refreshTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};
</script>

<style scoped>
.board-container {
  height: calc(100vh - 64px); /* Subtract header height */
}

.board-content {
  height: calc(100% - 72px); /* Subtract header height */
}
</style>