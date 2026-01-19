<template>
    <div class="page-container">
        <canvas ref="canvas" id="clock"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { Experience } from '@/three/core/Experience'
import { ClockWorld } from '@/three/worlds/ClockWorld'

const canvas = ref<HTMLCanvasElement | null>(null)
let experience: Experience | null = null
let clockWorld: ClockWorld | null = null

onMounted(async () => {
    if (canvas.value) {
        experience = new Experience(canvas.value)
        clockWorld = new ClockWorld()
        await experience.setWorld(clockWorld)
    }
})

onBeforeUnmount(() => {
    if (experience) {
        experience.dispose()
    }
})
</script>
<style scoped>
.page-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: inherit;
}

p {
    font-size: 1.2rem;
    color: inherit;
    opacity: 0.85;
}
</style>
