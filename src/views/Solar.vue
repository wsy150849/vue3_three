<template>
  <div ref="container" class="solar-container">
    <div class="slider">
      <svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
        <!-- 滑块轨道 -->
        <rect x="10" y="50" width="380" height="10" fill="lightgrey" />
        <!-- 滑块按钮 -->
        <circle id="sliderKnob" cx="20" cy="55" r="10" fill="blue" />
      </svg>

    </div>
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
let worldSpeed = ref(0.5) // 默认速度

onMounted(() => {
  if (!canvas.value) return
  experience = new Experience(canvas.value)
  experience.setWorld(new SolarWorld())
  handleSliderKnob()

  // 只添加一次 tick 监听器
  if (experience.time) {
    const updateWithSpeed = (dt: number) => {
      experience.world?.update(dt * worldSpeed.value)
      experience.renderer?.update()
    }
    experience.time.on('tick', updateWithSpeed)
  }
})

const handleSliderKnob = () => {
  const sliderKnob = document.getElementById('sliderKnob')
  if (!sliderKnob) return

  const minX = 20
  const maxX = 380

  sliderKnob.addEventListener('mousedown', (e) => {
    const startX = e.clientX
    const initialCx = parseInt(sliderKnob.getAttribute('cx') || '0')

    e.preventDefault()

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      let newX = initialCx + deltaX

      // 限制在边界内
      newX = Math.max(minX, Math.min(maxX, newX))

      sliderKnob.setAttribute('cx', newX.toString())

      // 根据滑块位置更新速度（不添加新监听器）
      const cx = parseInt(sliderKnob.getAttribute('cx') || '0')
      const normalizedCx = (cx - minX) / (maxX - minX) // 归一化到 0-1
      worldSpeed.value = normalizedCx * 2 // 速度范围 0-2
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  })
}

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

.slider {
  position: fixed;
  top: 100px;
  right: 100px;
  z-index: 999;
}
</style>
