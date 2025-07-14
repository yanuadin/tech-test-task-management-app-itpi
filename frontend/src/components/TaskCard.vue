<template>
  <div v-if="!isEditing"
       @click.stop="$emit('click')"
       class="bg-white p-3 rounded shadow-sm hover:shadow-md cursor-pointer">
    <h4 class="font-medium mb-1">{{ task.title }}</h4>
    <p v-if="task.description" class="text-sm text-gray-600 mb-2 line-clamp-2">{{ task.description }}</p>
    <div v-if="task.due_date" class="text-xs text-gray-500 mb-2">
      Due: {{ formatDate(task.due_date) }}
    </div>
    <div class="flex justify-between items-center">
      <span class="text-xs px-2 py-1 rounded-full"
            :class="statusClasses[task.status] || 'bg-gray-100 text-gray-800'">
        {{ task.status }}
      </span>
      <div class="flex space-x-1">
        <button @click.stop="startEditing" class="text-gray-400 hover:text-blue-500 text-sm cursor-pointer">
          ✏️
        </button>
        <button @click.stop="$emit('delete-task')" class="text-gray-400 hover:text-red-500 text-sm cursor-pointer">
          &times;
        </button>
      </div>
    </div>
  </div>

  <!-- Edit Mode -->
  <div v-else class="bg-white p-3 rounded shadow-sm border border-blue-200">
    <input v-model="editedTask.title"
           ref="titleInput"
           class="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
           placeholder="Task title">

    <textarea v-model="editedTask.description"
              class="w-full p-2 mb-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Description"
              rows="2"></textarea>

    <div class="flex items-center mb-2">
      <label class="text-xs text-gray-500 mr-2">Due:</label>
      <input v-model="editedTask.due_date"
             type="date"
             class="p-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
    </div>

    <select v-model="editedTask.status"
            class="w-full p-1 mb-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
      <option v-for="(value, key) in statusClasses" :value="key" :key="key">
        {{ key }}
      </option>
    </select>

    <div class="flex justify-end space-x-2">
      <button @click.stop="cancelEditing"
              class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
        Cancel
      </button>
      <button @click.stop="saveChanges"
              class="px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded">
        Save
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, defineProps, defineEmits } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click', 'delete-task', 'update-task']);

const isEditing = ref(false);
const titleInput = ref(null);
const editedTask = ref({
  title: '',
  description: '',
  due_date: '',
  status: 'initial'
});

const statusClasses = {
  'initial': 'bg-blue-100 text-blue-800',
  'progress': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-green-100 text-green-800',
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const startEditing = () => {
  isEditing.value = true;
  editedTask.value = {
    title: props.task.title,
    description: props.task.description || '',
    due_date: props.task.due_date ? props.task.due_date.split('T')[0] : '',
    status: props.task.status || 'initial'
  };
  nextTick(() => {
    titleInput.value.focus();
  });
};

const cancelEditing = () => {
  isEditing.value = false;
};

const saveChanges = () => {
  if (editedTask.value.title.trim()) {
    const updatedTask = {
      ...editedTask.value,
      // Format date back to ISO string if needed
      due_date: editedTask.value.due_date ? new Date(editedTask.value.due_date).toISOString() : null
    };
    emit('update-task', updatedTask);
    isEditing.value = false;
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>