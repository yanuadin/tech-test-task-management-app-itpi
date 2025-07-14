<template>
  <div @click.stop="$emit('click')"
       class="bg-white p-3 rounded shadow-sm hover:shadow-md cursor-pointer">
    <h4 class="font-medium mb-1">{{ task.title }}</h4>
    <p v-if="task.desc" class="text-sm text-gray-600 mb-2 line-clamp-2">{{ task.desc }}</p>
    <div v-if="task.due_date" class="text-xs text-gray-500 mb-2">
      Due: {{ formatDate(task.due_date) }}
    </div>
    <div class="flex justify-between items-center">
            <span class="text-xs px-2 py-1 rounded-full"
                  :class="statusClasses[task.status] || 'bg-gray-100 text-gray-800'">
                {{ task.status }}
            </span>
      <button @click.stop="$emit('delete')" class="text-gray-400 hover:text-red-500 text-sm">
        &times;
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

defineEmits(['click', 'delete']);

const statusClasses = {
  'todo': 'bg-blue-100 text-blue-800',
  'in_progress': 'bg-yellow-100 text-yellow-800',
  'done': 'bg-green-100 text-green-800',
  'blocked': 'bg-red-100 text-red-800'
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>