<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

onMounted(() => {
  // Check if user is authenticated on app load
  if (localStorage.getItem('token')) {
    authStore.isAuthenticated = true;
    // You might want to fetch user data here
  }
});
</script>

<style>
@import "tailwindcss";

/* Custom styles */
body {
  @apply bg-gray-50;
}
</style>