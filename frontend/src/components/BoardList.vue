<template>
  <div class="bg-gray-100 rounded-lg w-72 flex-shrink-0 h-fit">
    <div class="p-2 flex justify-between items-center">
      <input
          v-if="isEditing"
          v-model="editedListName"
          @blur="saveListName"
          @keyup.enter="saveListName"
          class="w-full px-2 py-1 font-semibold bg-white rounded border border-blue-300 focus:outline-none focus:border-blue-500"
          type="text"
          ref="nameInput"
      >
      <h3 v-else @click="startEditing" class="font-semibold px-2 py-1 cursor-text">{{ list.title }}</h3>

      <button
          @click="openDeleteListModal"
          class="text-red-800 hover:text-red-500 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <div class="px-2 pb-2 space-y-2 min-h-20">
      <TaskCard
          v-for="task in list.tasks"
          :key="task.id"
          :task="task"
          @update-task="(updatedData) => $emit('update-task', list.id, task.id, updatedData)"
          @delete-task="() => $emit('delete-task', list.id, task.id)"
      />
    </div>

    <div v-if="isAddingTask" class="p-2 space-y-2">
      <!-- Title -->
      <input
          v-model="newTask.title"
          ref="taskInput"
          class="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
          placeholder="Task title"
          required
      >

      <!-- Description -->
      <textarea
          v-model="newTask.description"
          class="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500 text-sm"
          placeholder="Add description..."
          rows="2"
      ></textarea>

      <!-- Due Date -->
      <div class="flex items-center space-x-2">
        <label class="text-sm text-gray-600">Due Date:</label>
        <input
            v-model="newTask.due_date"
            type="date"
            class="p-1 rounded border border-gray-300 focus:outline-none focus:border-blue-500 text-sm"
        >
      </div>

      <!-- Status -->
      <div class="flex items-center space-x-2">
        <label class="text-sm text-gray-600">Status:</label>
        <select
            v-model="newTask.status"
            class="p-1 rounded border border-gray-300 focus:outline-none focus:border-blue-500 text-sm"
        >
          <option value="initial">Initial</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <!-- File Upload -->
      <div class="flex flex-col space-y-1">
        <label class="text-sm text-gray-600">Attachment:</label>
        <input
            type="file"
            ref="fileInput"
            @change="handleFileUpload"
            class="text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-md file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100"
        >
        <p v-if="newTask.file_path" class="text-xs text-gray-500 mt-1">
          Selected file: {{ newTask.file_path.name }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex mt-2 space-x-2">
        <button
            @click="addTask"
            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          Add Task
        </button>
        <button
            @click="cancelAddTask"
            class="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    <button
        v-else
        @click="startAddTask"
        class="w-full text-left p-2 text-gray-600 hover:bg-gray-200 rounded-lg flex items-center"
    >
      <span class="mr-1">+</span> Add a task
    </button>

    <Modal :isOpen="isDeleteListModalOpen" @close="closeDeleteListModal">
      <template #title>Delete List</template>
      <template #content>
        <p>Are you sure you want to delete this list and all its tasks?</p>
      </template>
      <template #footer>
        <button
            type="button"
            @click="confirmDeleteList"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Delete
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import Modal from './Modal.vue';
import TaskCard from './TaskCard.vue';

const props = defineProps({
  list: {
    type: Object,
    required: true
  },
  onTaskAdded: { // Add this prop for refresh callback
    type: Function,
    default: () => {}
  }
});

const emit = defineEmits(['update-list', 'delete-list', 'create-task', 'update-task', 'delete-task']);

const isEditing = ref(false);
const editedListName = ref(props.list.name);
const nameInput = ref(null);

const fileInput = ref(null);
const isAddingTask = ref(false);
const newTask = ref({
  title: '',
  description: '',
  due_date: new Date().toISOString().split('T')[0],
  status: 'initial',
  file_path: null,
});
const taskInput = ref(null);

const isDeleteListModalOpen = ref(false);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newTask.value.file_path = file;
  }
};

const startEditing = () => {
  isEditing.value = true;
  editedListName.value = props.list.name;
  nextTick(() => {
    nameInput.value.focus();
  });
};

const saveListName = async () => {
  if (editedListName.value.trim() && editedListName.value !== props.list.name) {
    await emit('update-list', props.list.id, { title: editedListName.value, board_id: props.list.board_id });
  }
  isEditing.value = false;
};

const startAddTask = () => {
  isAddingTask.value = true;
  nextTick(() => {
    taskInput.value.focus();
  });
};

const cancelAddTask = () => {
  isAddingTask.value = false;
  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const addTask = async () => {
  if (newTask.value.title.trim()) {
    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append('title', newTask.value.title);
    formData.append('description', newTask.value.description);
    formData.append('due_date', newTask.value.due_date);
    formData.append('status', newTask.value.status);

    // Only append file if one was selected
    if (newTask.value.file_path) {
      formData.append('file', newTask.value.file_path);
    }

    try {
      await emit('create-task', props.list.id, formData);
      // Refresh the task list after successful addition
      props.onTaskAdded(); // Call parent's refresh function

      // Reset form
      isAddingTask.value = false;
      newTask.value = {
        title: '',
        description: '',
        due_date: new Date().toISOString().split('T')[0],
        status: 'initial',
        file_path: null
      };
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }
};

const openDeleteListModal = () => {
  isDeleteListModalOpen.value = true;
};

const closeDeleteListModal = () => {
  isDeleteListModalOpen.value = false;
};

const confirmDeleteList = async () => {
  await emit('delete-list', props.list.id);
  closeDeleteListModal();
};
</script>