<template>
  <div v-if="board" class="p-4">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">{{ board.title }}</h2>
      <button @click="showAddList = true"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Add List
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else class="flex space-x-4 overflow-x-auto pb-4">
      <VueDraggableNext
          v-model="lists"
          group="lists"
          item-key="id"
          @end="onListDragEnd"
          class="flex space-x-4">
        <template #item="{ element: list }">
          <ListCard
              :list="list"
              @delete="deleteList"
              @task-selected="openTaskModal"
              @task-deleted="deleteTask" />
        </template>
      </VueDraggableNext>

      <div v-if="showAddList" class="bg-gray-100 rounded-lg p-4 w-72">
        <input v-model="newListTitle" type="text" placeholder="Enter list title..."
               class="w-full px-3 py-2 border rounded-md mb-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
               @keyup.enter="createList">
        <div class="flex space-x-2">
          <button @click="createList" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add
          </button>
          <button @click="showAddList = false" class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </div>

      <button v-else @click="showAddList = true"
              class="h-12 w-72 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg">
        + Add another list
      </button>
    </div>

    <TaskModal
        v-if="selectedTask"
        :task="selectedTask"
        :listId="selectedTask.list_id"
        @close="selectedTask = null"
        @updated="handleTaskUpdated" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next'
import ListCard from './ListCard.vue';
import TaskModal from './TaskModal.vue';
import { useBoardsStore } from '@/stores/boards';

const props = defineProps({
  boardId: {
    type: [Number, String],
    required: true
  }
});

const boardsStore = useBoardsStore();
const loading = ref(true);
const showAddList = ref(false);
const newListTitle = ref('');
const selectedTask = ref(null);

const board = computed(() => boardsStore.currentBoard);
const lists = computed({
  get() {
    return boardsStore.lists;
  },
  set(value) {
    // Handled by drag and drop
  }
});

onMounted(async () => {
  try {
    await boardsStore.fetchBoard(props.boardId);
    await boardsStore.fetchBoardLists(props.boardId);
    loading.value = false;
  } catch (error) {
    console.error('Error loading board:', error);
  }
});

const createList = async () => {
  if (!newListTitle.value.trim()) return;

  try {
    await boardsStore.createList(props.boardId, { title: newListTitle.value });
    newListTitle.value = '';
    showAddList.value = false;
  } catch (error) {
    console.error('Error creating list:', error);
  }
};

const deleteList = async (listId) => {
  try {
    await boardsStore.deleteList(props.boardId, listId);
  } catch (error) {
    console.error('Error deleting list:', error);
  }
};

const onListDragEnd = async (event) => {
  // You might want to update the order of lists here
  console.log('List reordered', event);
};

const openTaskModal = (task) => {
  selectedTask.value = task;
};

const handleTaskUpdated = (task) => {
  selectedTask.value = null;
};

const deleteTask = async (taskId) => {
  try {
    const task = boardsStore.tasks.find(t => t.id === taskId);
    if (task) {
      await boardsStore.deleteTask(task.list_id, taskId);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};
</script>