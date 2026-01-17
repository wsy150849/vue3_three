<template>
  <div class="page-container">
    <h1>作品集</h1>
    <p>这里展示我的 3D 作品集</p>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { onMounted } from 'vue'

onMounted(() => {
  let tl = gsap.timeline()
  tl.to('h1', {
    duration: 2,
    left: '50%',
    x: '-50%',
    ease: 'elastic.out(1, 0.3)'
  }).to(
    'p',
    {
      duration: 2,
      left: '50%',
      x: '-50%',
      ease: 'elastic.out(1, 0.3)'
    },
    '-=1.5'
  )

  let h1: HTMLHeadingElement | null = document.querySelector('h1')

  h1?.addEventListener('mouseenter', () => {
    gsap.to(h1, {
      duration: 1,
      color: 'red',
      rotation: 360,
      ease: 'power2.out'
    })
  })
})
</script>
<style scoped>
.page-container {
  position: relative;
  width: 100vw;
  overflow: hidden;
  padding-top: 80px;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: inherit;
}

h1 {
  position: absolute;
  font-size: 3rem;
  left: 0;
  top: 45%;
  transform: translateX(0);
  white-space: nowrap;
  color: inherit;
}

p {
  position: absolute;
  font-size: 1.2rem;
  left: 0;
  top: 55%;
  transform: translateX(0);
  white-space: nowrap;
  color: inherit;
  opacity: 0.85;
}
</style>
