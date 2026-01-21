<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isDark = ref(true)

const activeSection = computed(() => {
  const path = route.path.replace('/', '') || 'home'
  return path
})

const sections = [
  { name: '首页', id: '/' },
  { name: '太阳系', id: '/solar' },
  { name: '时钟', id: '/clock' },
  { name: '作品集', id: '/portfolio' },
  { name: '关于', id: '/about' },
  { name: '联系', id: '/contact' }
]

const navigateTo = (path: string) => {
  router.push(path)
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}
</script>

<template>
  <nav class="navbar" :class="{ light: !isDark }">
    <div class="nav-container">
      <div class="logo">
        <span class="logo-text">3D</span>
        <span class="logo-accent">Studio</span>
      </div>

      <ul class="nav-links">
        <li v-for="section in sections" :key="section.id">
          <a
            @click="navigateTo(section.id)"
            :class="{ active: activeSection === section.id.replace('/', '') || (activeSection === 'home' && section.id === '/') }"
            class="nav-link"
          >
            <span class="link-text">{{ section.name }}</span>
            <span class="link-indicator"></span>
          </a>
        </li>
      </ul>

      <div class="nav-actions">
        <button class="theme-toggle" @click="toggleTheme" aria-label="切换主题">
          <svg v-if="isDark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
        <button class="menu-toggle" aria-label="菜单">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.navbar.light {
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  position: relative;
}

.logo-text {
  font-weight: 900;
}

.logo-accent {
  font-weight: 300;
  margin-left: 4px;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
}

.nav-link {
  position: relative;
  display: block;
  padding: 0.75rem 1.5rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.3s ease;
  overflow: hidden;
  cursor: pointer;
}

.navbar.light .nav-link {
  color: rgba(0, 0, 0, 0.75);
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar.light .nav-link::before {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
}

.nav-link:hover::before {
  transform: translateY(0);
}

.nav-link:hover {
  color: #fff;
}

.navbar.light .nav-link:hover {
  color: #667eea;
}

.nav-link.active {
  color: #fff;
}

.navbar.light .nav-link.active {
  color: #667eea;
}

.nav-link.active::before {
  transform: translateY(0);
}

.link-text {
  position: relative;
  z-index: 1;
}

.link-indicator {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
  border-radius: 2px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link:hover .link-indicator,
.nav-link.active .link-indicator {
  transform: translateX(-50%) scaleX(1);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle,
.menu-toggle {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.6rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.85);
}

.navbar.light .theme-toggle,
.navbar.light .menu-toggle {
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.7);
}

.theme-toggle:hover,
.menu-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.navbar.light .theme-toggle:hover,
.navbar.light .menu-toggle:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.3);
  color: #667eea;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
}

.menu-toggle {
  flex-direction: column;
  gap: 4px;
  padding: 0.5rem 0.6rem;
}

.menu-toggle span {
  display: block;
  width: 20px;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.menu-toggle:hover span:nth-child(1) {
  transform: translateY(-2px);
}

.menu-toggle:hover span:nth-child(3) {
  transform: translateY(2px);
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }

  .nav-links {
    display: none;
  }

  .logo {
    font-size: 1.5rem;
  }

  .theme-toggle {
    display: none;
  }
}

@media (min-width: 769px) {
  .menu-toggle {
    display: none;
  }
}
</style>
