<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Welcome message -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Welcome to Your Task Manager</h1>
      <p class="text-gray-600">Organize your work and boost your productivity</p>
    </div>

    <!-- Quick actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <router-link
          to="/boards"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
      >
        <div class="mr-4 text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-1">View All Boards</h3>
          <p class="text-sm text-gray-600">Access all your task boards</p>
        </div>
      </router-link>

      <router-link
          to="/boards/new"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
          @click.prevent="createNewBoard"
      >
        <div class="mr-4 text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-1">Create New Board</h3>
          <p class="text-sm text-gray-600">Start organizing new projects</p>
        </div>
      </router-link>

      <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center cursor-pointer" @click="showRecentTasks = !showRecentTasks">
        <div class="mr-4 text-purple-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-1">Recent Tasks</h3>
          <p class="text-sm text-gray-600">View your recently updated tasks</p>
        </div>
      </div>
    </div>

    <!-- Recent Boards Section -->
    <section class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Your Recent Boards</h2>
        <router-link to="/boards" class="text-blue-500 hover:text-blue-700 text-sm">View All</router-link>
      </div>

      <div v-if="loading" class="flex justify-center items-center h-32">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="board in recentBoards" :key="board.id" class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer" @click="goToBoard(board.id)">
          <h3 class="text-lg font-semibold mb-2">{{ board.title }}</h3>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>{{ board.lists_count || 0 }} lists</span>
            <span>Last updated: {{ formatDate(board.updated_at) }}</span>
          </div>
        </div>

        <div v-if="recentBoards.length === 0" class="col-span-full text-center py-8">
          <p class="text-gray-500 mb-4">You don't have any boards yet</p>
          <button @click="createNewBoard" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Create Your First Board
          </button>
        </div>
      </div>
    </section>

    <!-- Recent Tasks Section (conditional) -->
    <section v-if="showRecentTasks" class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Recently Updated Tasks</h2>
        <button @click="showRecentTasks = false" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <div v-if="loadingTasks" class="flex justify-center items-center h-32">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
        <div v-for="task in recentTasks" :key="task.id" class="border-b last:border-b-0 p-4 hover:bg-gray-50">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-medium">{{ task.title }}</h3>
              <p class="text-sm text-gray-600">{{ task.desc || 'No description' }}</p>
            </div>
            <span class="text-xs px-2 py-1 rounded-full" :class="getStatusClass(task.status)">
              {{ task.status }}
            </span>
          </div>
          <div class="mt-2 flex justify-between items-center text-xs text-gray-500">
            <span>Due: {{ task.due_date ? formatDate(task.due_date) : 'No due date' }}</span>
            <router-link :to="`/boards/${task.board_id}`" class="text-blue-500 hover:underline">
              Go to board
            </router-link>
          </div>
        </div>

        <div v-if="recentTasks.length === 0" class="text-center py-8 text-gray-500">
          No recent tasks found
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBoardsStore } from '@/stores/boards'

const router = useRouter()
const boardsStore = useBoardsStore()

const loading = ref(true)
const loadingTasks = ref(true)
const showRecentTasks = ref(false)
const recentBoards = ref([])
const recentTasks = ref([])

onMounted(async () => {
  try {
    await boardsStore.fetchBoards()
    recentBoards.value = boardsStore.boards.slice(0, 3) // Get first 3 boards
    loading.value = false

    // Simulate fetching recent tasks (you would replace this with actual API call)
    setTimeout(() => {
      recentTasks.value = [
        {
          id: 1,
          title: 'Implement authentication',
          desc: 'Set up login and registration',
          status: 'done',
          due_date: '2023-06-15',
          board_id: 1
        },
        {
          id: 2,
          title: 'Design board UI',
          desc: 'Create mockups for board view',
          status: 'in_progress',
          due_date: '2023-06-20',
          board_id: 1
        },
        {
          id: 3,
          title: 'Set up database',
          desc: 'Configure PostgreSQL schema',
          status: 'todo',
          due_date: '2023-06-10',
          board_id: 2
        }
      ]
      loadingTasks.value = false
    }, 500)
  } catch (error) {
    console.error('Error loading data:', error)
    loading.value = false
    loadingTasks.value = false
  }
})

function createNewBoard() {
  // You would implement actual board creation logic here
  router.push('/boards/new')
}

function goToBoard(boardId) {
  router.push(`/boards/${boardId}`)
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

function getStatusClass(status) {
  const classes = {
    'todo': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-yellow-100 text-yellow-800',
    'done': 'bg-green-100 text-green-800',
    'blocked': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>