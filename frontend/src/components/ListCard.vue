<template>
  <div class="bg-gray-100 rounded-lg p-4 w-72 flex flex-col">
    <div class="flex justify-between items-center mb-3">
      <h3 class="font-semibold">{{ list.title }}</h3>
      <button @click="$emit('delete', list.id)" class="text-gray-500 hover:text-red-500">
        &times;
      </button>
    </div>

    <div class="flex-1 min-h-20">
      <VueDraggableNext
          v-model="tasks"
          group="tasks"
          item-key="id"
          @end="onDragEnd"
          class="space-y-2">
        <template #item="{ element: task }">
          <TaskCard
              :task="task"
              @click="$emit('task-selected', task)"
              @delete="$emit('task-deleted', task.id)" />
        </template>
      </VueDraggableNext>
    </div>

    <button @click="showAddTask = true" class="mt-3 text-gray-500 hover:text-gray-700 text-left">
      + Add a task
    </button>

    <TaskModal
        v-if="showAddTask"
        :listId="list.id"
        @close="showAddTask = false"
        @created="handleTaskCreated" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next'
import TaskCard from './TaskCard.vue';
import TaskModal from './TaskModal.vue';
import { useBoardsStore } from '@/stores/boards';

const props = defineProps({
  list: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['delete', 'task-selected', 'task-deleted']);

const boardsStore = useBoardsStore();
const showAddTask = ref(false);

const tasks = computed({
  get() {
    return boardsStore.tasks.filter(task => task.list_id === props.list.id);
  },
  set(value) {
    // This is handled by the drag and drop
  }
});

const onDragEnd = async (event) => {
  if (event.to !== event.from) {
    const taskId = event.item._underlying_vm_.id;
    const newListId = props.list.id;
    await boardsStore.updateTask(newListId, taskId, { list_id: newListId });
  }
};

const handleTaskCreated = (task) => {
  showAddTask.value = false;
  emit('task-created', task);
};
</script>