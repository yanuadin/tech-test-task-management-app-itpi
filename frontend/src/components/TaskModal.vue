<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">{{ editing ? 'Edit Task' : 'Add New Task' }}</h3>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input v-model="form.title" type="text" required
                   class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="form.desc" rows="3"
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input v-model="form.due_date" type="date"
                   class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="form.status"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option v-for="status in statuses" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
            <input type="file" @change="handleFileUpload"
                   class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button type="button" @click="closeModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            Cancel
          </button>
          <button type="submit"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
            {{ editing ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useBoardsStore } from '@/stores/boards';

const props = defineProps({
  task: {
    type: Object,
    default: null
  },
  listId: {
    type: [Number, String],
    required: true
  }
});

const emit = defineEmits(['close', 'created', 'updated']);

const boardsStore = useBoardsStore();
const editing = ref(false);
const statuses = ref(['todo', 'in_progress', 'done', 'blocked']);
const form = ref({
  title: '',
  desc: '',
  due_date: '',
  status: 'todo',
  file: null
});

onMounted(() => {
  if (props.task) {
    editing.value = true;
    form.value = {
      title: props.task.title,
      desc: props.task.desc,
      due_date: props.task.due_date ? props.task.due_date.split('T')[0] : '',
      status: props.task.status,
      file: null
    };
  }
});

const closeModal = () => {
  emit('close');
};

const handleFileUpload = (event) => {
  form.value.file = event.target.files[0];
};

const handleSubmit = async () => {
  try {
    const taskData = {
      title: form.value.title,
      desc: form.value.desc,
      due_date: form.value.due_date,
      status: form.value.status,
      list_id: props.listId
    };

    if (editing.value) {
      const updatedTask = await boardsStore.updateTask(props.listId, props.task.id, taskData);
      emit('updated', updatedTask);
    } else {
      const newTask = await boardsStore.createTask(props.listId, taskData);
      emit('created', newTask);
    }

    closeModal();
  } catch (error) {
    console.error('Error saving task:', error);
  }
};
</script>