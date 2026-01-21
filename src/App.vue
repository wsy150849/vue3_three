<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'

const isDark = ref(true)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
})
</script>

<template>
  <Navbar />
  <div class="content-wrapper" :class="{ light: !isDark }">
    <router-view :key="$route.fullPath" />
  </div>
</template>

<style scoped>
.content-wrapper {
  min-height: 100vh;
  transition: background 0.3s ease;
}
</style>
