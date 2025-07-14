<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Your Boards</h1>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        <BoardCard
            v-for="board in boards"
            :key="board.id"
            :board="board"
            @select="viewBoard"
            @delete="deleteBoard" />

        <div @click="showAddBoard = true"
             class="bg-gray-100 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-gray-200">
          <span class="text-gray-600">+ Create new board</span>
        </div>
      </div>

      <div v-if="showAddBoard" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md" @click.stop>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Create New Board</h3>
            <button @click="showAddBoard = false" class="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>

          <form @submit.prevent="createBoard">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Board Title</label>
              <input v-model="newBoardTitle" type="text" required
                     class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showAddBoard = false"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                Cancel
              </button>
              <button type="submit"
                      class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import BoardCard from '@/components/BoardCard.vue';
import { useBoardsStore } from '@/stores/boards';

const router = useRouter();
const boardsStore = useBoardsStore();
const loading = ref(true);
const showAddBoard = ref(false);
const newBoardTitle = ref('');
const boards = computed(() => boardsStore.boards);

onMounted(async () => {
  try {
    await boardsStore.fetchBoards();
    loading.value = false;
  } catch (error) {
    console.error('Error loading boards:', error);
  }
});

const viewBoard = (boardId) => {
  router.push(`/boards/${boardId}`);
};

const createBoard = async () => {
  if (!newBoardTitle.value.trim()) return;

  try {
    await boardsStore.createBoard({ title: newBoardTitle.value });
    newBoardTitle.value = '';
    showAddBoard.value = false;
  } catch (error) {
    console.error('Error creating board:', error);
  }
};

const deleteBoard = async (boardId) => {
  try {
    await boardsStore.deleteBoard(boardId);
  } catch (error) {
    console.error('Error deleting board:', error);
  }
};
</script>