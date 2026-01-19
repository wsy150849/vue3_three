<template>
  <div class="page-container">
    <h1>作品集</h1>
    <p>这里展示我的 3D 作品集</p>

    <div class="slider-container">
      <div class="slider" ref="sliderRef">
        <div
          v-for="(item, index) in portfolioItems"
          :key="index"
          class="slide"
          :class="{ active: currentIndex === index }"
          @mouseenter="onSlideHover(index)"
          @mouseleave="onSlideLeave"
        >
          <div class="slide-content">
            <div class="slide-image" :style="{ background: item.color }">
              <span class="slide-number">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>
            <div class="slide-info">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <div class="slide-tags">
                <span v-for="(tag, tagIndex) in item.tags" :key="tagIndex" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="slider-controls">
        <button class="control-btn prev" @click="prevSlide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <div class="dots">
          <span
            v-for="(item, index) in portfolioItems"
            :key="index"
            class="dot"
            :class="{ active: currentIndex === index }"
            @click="goToSlide(index)"
          ></span>
        </div>
        <button class="control-btn next" @click="nextSlide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

interface PortfolioItem {
  title: string
  description: string
  color: string
  tags: string[]
}

const portfolioItems: PortfolioItem[] = [
  {
    title: '3D 太阳系',
    description: '使用 Three.js 创建的交互式太阳系模拟',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    tags: ['Three.js', 'WebGL', '3D']
  },
  {
    title: '粒子动画',
    description: '基于 Canvas 的高性能粒子效果',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    tags: ['Canvas', 'Animation', 'Particles']
  },
  {
    title: '地形生成',
    description: '程序化生成的 3D 地形系统',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    tags: ['Procedural', 'Noise', 'Terrain']
  },
  {
    title: '光影效果',
    description: '实时光照和阴影渲染',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    tags: ['Lighting', 'Shadows', 'PBR']
  }
]

const currentIndex = ref(0)
const sliderRef = ref<HTMLElement>()
const autoPlayInterval = ref<number>()

onMounted(() => {
  // 标题动画
  let tl = gsap.timeline()
  tl.to('h1', {
    duration: 2,
    left: '50%',
    x: '-50%',
    ease: 'elastic.out(1, 0.3)'
  }).to('p', {
    duration: 2,
    left: '50%',
    x: '-50%',
    ease: 'elastic.out(1, 0.3)'
  }, '-=1.5')

  // 滑块进入动画
  gsap.from('.slider-container', {
    duration: 1.5,
    opacity: 0,
    y: 50,
    ease: 'power3.out',
    delay: 0.5
  })

  gsap.from('.slide', {
    duration: 1,
    opacity: 0,
    x: 100,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 1
  })

  // 自动播放
  startAutoPlay()
})

onBeforeUnmount(() => {
  stopAutoPlay()
})

const startAutoPlay = () => {
  autoPlayInterval.value = window.setInterval(() => {
    nextSlide()
  }, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
  }
}

const goToSlide = (index: number) => {
  currentIndex.value = index
  stopAutoPlay()
  startAutoPlay()
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % portfolioItems.length
  stopAutoPlay()
  startAutoPlay()
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + portfolioItems.length) % portfolioItems.length
  stopAutoPlay()
  startAutoPlay()
}

const onSlideHover = (index: number) => {
  stopAutoPlay()
  gsap.to(`.slide:nth-child(${index + 1})`, {
    duration: 0.3,
    scale: 1.05,
    ease: 'power2.out'
  })
}

const onSlideLeave = () => {
  startAutoPlay()
  gsap.to('.slide', {
    duration: 0.3,
    scale: 1,
    ease: 'power2.out'
  })
}
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
  justify-content: flex-start;
  color: inherit;
  padding-bottom: 60px;
}

h1 {
  font-size: 3rem;
  margin: 2rem 0 1rem;
  text-align: center;
  color: inherit;
  position: relative;
  left: 0;
  top: 0;
  transform: none;
  white-space: normal;
}

p {
  font-size: 1.2rem;
  text-align: center;
  color: inherit;
  opacity: 0.85;
  position: relative;
  left: 0;
  top: 0;
  transform: none;
  white-space: normal;
  margin-bottom: 3rem;
}

.slider-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.slider {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  padding: 2rem;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.slider::-webkit-scrollbar {
  display: none;
}

.slide {
  flex: 0 0 300px;
  height: 400px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
}

:global([data-theme="light"]) .slide {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.slide:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

:global([data-theme="light"]) .slide:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.slide.active {
  border-color: #667eea;
  box-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
}

.slide-content {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.slide-image {
  width: 100%;
  height: 180px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}

.slide-number {
  font-size: 4rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.3);
  font-family: 'Arial', sans-serif;
}

.slide-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.slide-info h3 {
  margin: 0;
  font-size: 1.5rem;
  color: inherit;
}

.slide-info p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  text-align: left;
  opacity: 0.75;
}

.slide-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
}

.tag {
  padding: 0.4rem 0.8rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #667eea;
  transition: all 0.3s ease;
}

:global([data-theme="light"]) .tag {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.slider-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}

.control-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

:global([data-theme="light"]) .control-btn {
  border-color: rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.9);
  color: rgba(0, 0, 0, 0.7);
}

.control-btn:hover {
  background: #667eea;
  border-color: #667eea;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.dots {
  display: flex;
  gap: 0.75rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

:global([data-theme="light"]) .dot {
  background: rgba(0, 0, 0, 0.3);
}

.dot:hover {
  background: rgba(102, 126, 234, 0.7);
  transform: scale(1.3);
}

.dot.active {
  background: #667eea;
  transform: scale(1.5);
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
}

@media (max-width: 768px) {
  .slide {
    flex: 0 0 260px;
    height: 350px;
  }

  .slider {
    padding: 1rem;
    gap: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  p {
    font-size: 1rem;
  }
}
</style>
