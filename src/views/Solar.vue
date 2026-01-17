<template>
  <canvas ref="canvas" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Experience } from '@/three/core/Experience'
import { SolarWorld } from '@/three/worlds/SolarWorld'

const canvas = ref<HTMLCanvasElement>()

onMounted(() => {
  if (!canvas.value) return
  const exp = new Experience(canvas.value)
  exp.setWorld(new SolarWorld())
})
</script>

<style>
canvas {
  width: 100vw;
  height: 100vh;
  display: block;
}
</style>
