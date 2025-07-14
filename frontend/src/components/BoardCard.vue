<template>
  <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
       @click="$emit('select', board.id)">
    <h3 class="text-lg font-semibold mb-2">{{ board.title }}</h3>
    <div class="flex justify-between items-center text-sm text-gray-500">
      <span>{{ board.lists_count || 0 }} lists</span>
      <button @click.stop="$emit('delete', board.id)" class="text-red-500 hover:text-red-700">
        Delete
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  board: {
    type: Object,
    required: true
  }
});

defineEmits(['select', 'delete']);
</script>