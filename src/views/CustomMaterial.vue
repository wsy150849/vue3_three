<template>
    <div class="page-container">
        <canvas ref="canvas" id="clock"></canvas>
    </div>
</template>
<script setup lang="ts">
import * as THREE from 'three'
import { Experience } from '@/three/core/Experience'
import { CustomMaterialWorld } from '@/three/worlds/CustomMaterialWorld'
import { onMounted } from 'vue'
import { ref } from 'vue'
const canvas = ref<HTMLCanvasElement | null>(null)
let lastMoveTime = performance.now()
let mouseInside = false
const mouse = new THREE.Vector2(-100, -100)


function onMouseMove(event) {
    const rect = canvas.value?.getBoundingClientRect()
    mouse.x = ((event.clientX - (rect?.left || 0)) / (rect?.width || 1)) * 2 - 1

    mouse.y = -((event.clientY - (rect?.top || 0)) / (rect?.height || 1)) * 2 + 1
    lastMoveTime = performance.now()
    mouseInside = true
    // mouse.x = event.clientX
    // mouse.y = -event.clientY
}

function onMouseLeave() {
    mouseInside = false
}

function onMouseEnter(event) {
    // update mouse pos on re-enter
    onMouseMove(event)
    mouseInside = true
}

onMounted(async () => {
    if (canvas.value) {
        const experience = new Experience(canvas.value)
        let customMaterialWorld = new CustomMaterialWorld()
        await experience.setWorld(customMaterialWorld)
        canvas.value.addEventListener('mouseleave', onMouseLeave)
        canvas.value.addEventListener('mouseenter', onMouseEnter)

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
</style>