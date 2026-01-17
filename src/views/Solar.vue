<template>
  <div ref="container" class="solar-container">
    <canvas ref="canvas" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { Experience } from '@/three/core/Experience'
import { SolarWorld } from '@/three/worlds/SolarWorld'

const canvas = ref<HTMLCanvasElement>()
const container = ref<HTMLDivElement>()
let experience: Experience | null = null

onMounted(() => {
  if (!canvas.value) return
  experience = new Experience(canvas.value)
  experience.setWorld(new SolarWorld())
})

onBeforeUnmount(() => {
  if (experience) {
    experience.dispose()
    experience = null
  }
})
</script>

<style scoped>
.solar-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
