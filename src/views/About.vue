<template>
  <div class="page-container" ref="sectionRef">
    <div class="content-wrapper">
      <section class="intro">
        <h1>关于我</h1>
        <p class="subtitle">Creative Developer & 3D Enthusiast</p>
        <p class="bio">
          热衷于探索 Web 3D 技术与交互设计的边界。<br />
          我相信代码不仅仅是逻辑的堆砌，更是艺术的表达。<br />
          目前专注于 Vue 3 生态与 Three.js 的结合应用。
        </p>
      </section>

      <section class="skills">
        <h2>技术栈</h2>
        <div class="skill-tags">
          <span class="tag">Vue 3</span>
          <span class="tag">TypeScript</span>
          <span class="tag">Three.js</span>
          <span class="tag">WebGL</span>
          <span class="tag">Node.js</span>
          <span class="tag">Blender</span>
        </div>
      </section>

      <section class="contact">
        <h2>联系方式</h2>
        <p>Email: huey@example.com</p>
        <p>Github: @huey</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as THREE from "three";

const sectionRef = ref<HTMLElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let cloudParticles: THREE.Points[] = [];
let animationFrameId: number;

// Mouse state
const mouse = new THREE.Vector2(-1000, -1000);

onMounted(() => {
  if (sectionRef.value) {
    initThree();
    animate();
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onWindowResize);
  }
});

onUnmounted(() => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("resize", onWindowResize);
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  renderer?.dispose();
  scene?.clear();
});

function initThree() {
  scene = new THREE.Scene();
  // 背景白色
  scene.background = new THREE.Color(0xffffff);
  // 白色雾气，制造景深感
  scene.fog = new THREE.FogExp2(0xffffff, 0.0015);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.z = 100;
  // 稍微俯视
  camera.position.y = 20;
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: false 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Canvas 样式设置，使其作为背景
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.zIndex = "0";
  renderer.domElement.style.pointerEvents = "none"; // 让鼠标事件穿透到 HTML 内容

  if (sectionRef.value) {
    sectionRef.value.prepend(renderer.domElement);
  }

  // 加载纹理
  const textureLoader = new THREE.TextureLoader();
  // 使用 Three.js 示例纹理或本地纹理
  const sprite = textureLoader.load(
    "https://threejs.org/examples/textures/sprites/circle.png"
  );

  // 创建粒子云
  const particleCount = 800;
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    // 随机分布
    const x = THREE.MathUtils.randFloatSpread(400);
    const y = THREE.MathUtils.randFloatSpread(200);
    const z = THREE.MathUtils.randFloatSpread(400);
    positions.push(x, y, z);

    // 随机微动速度
    velocities.push(
      THREE.MathUtils.randFloat(-0.05, 0.05),
      THREE.MathUtils.randFloat(-0.05, 0.05),
      THREE.MathUtils.randFloat(-0.05, 0.05)
    );
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute(
    "velocity",
    new THREE.Float32BufferAttribute(velocities, 3)
  );

  const material = new THREE.PointsMaterial({
    color: 0x000000, // 墨色
    size: 6,
    transparent: true,
    opacity: 0.2, // 淡淡的墨迹
    map: sprite,
    blending: THREE.NormalBlending, // 在白背景下显示黑色需要 NormalBlending
    depthWrite: false,
    sizeAttenuation: true
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);
  cloudParticles.push(points);
}

function onMouseMove(event: MouseEvent) {
  // 归一化设备坐标 (-1 到 +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  animationFrameId = requestAnimationFrame(animate);

  const points = cloudParticles[0];
  if (points) {
    const positions = points.geometry.attributes.position;
    const velocities = points.geometry.attributes.velocity;

    // 将鼠标坐标转换为世界坐标的大致位置 (简单映射)
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const mouseWorld = camera.position.clone().add(dir.multiplyScalar(distance));
    
    // 为了简化效果，我们让鼠标影响 Z=0 平面附近的粒子，或者简单地使用投影
    // 这里使用一个简单的屏幕空间映射增强互动感
    const mouseSimpleX = mouse.x * 150;
    const mouseSimpleY = mouse.y * 100;

    for (let i = 0; i < positions.count; i++) {
      let vx = velocities.getX(i);
      let vy = velocities.getY(i);
      let vz = velocities.getZ(i);

      let x = positions.getX(i);
      let y = positions.getY(i);
      let z = positions.getZ(i);

      // 自然漂浮
      x += vx;
      y += vy;
      z += vz;

      // 边界检查，循环移动
      if (Math.abs(x) > 200) x = -x;
      if (Math.abs(y) > 100) y = -y;
      if (Math.abs(z) > 200) z = -z;

      // 鼠标互动：斥力效果
      // 简单计算粒子与鼠标投影点的距离
      const dx = x - mouseSimpleX;
      const dy = y - mouseSimpleY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // 如果鼠标在附近，推开粒子
      if (dist < 40) {
        const force = (40 - dist) / 40;
        x += (dx / dist) * force * 2;
        y += (dy / dist) * force * 2;
        // 稍微扰动Z轴
        z += Math.random() * force * 2;
      }

      // 回归原始速度（简单的阻尼效果不是必须的，因为我们希望它是漂浮的雾）
      
      positions.setXYZ(i, x, y, z);
    }
    positions.needsUpdate = true;
    
    // 整体轻微旋转
    points.rotation.y += 0.001;
    points.rotation.x += 0.0005;
  }

  renderer.render(scene, camera);
}
</script>

<style scoped>
.page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  /* 确保背景色也是白色，以防 canvas 加载前黑屏 */
  background-color: #fff; 
}

.content-wrapper {
  position: relative;
  z-index: 1; /* 在 canvas 之上 */
  max-width: 800px;
  margin: 0 auto;
  padding: 120px 20px 40px;
  color: #1a1a1a; /* 深灰黑色字体 */
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.intro {
  margin-bottom: 60px;
  text-align: center;
  animation: fadeInDown 1s ease-out;
}

h1 {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
  background: linear-gradient(45deg, #000, #555);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 2rem;
  font-weight: 300;
}

.bio {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
  max-width: 600px;
  margin: 0 auto;
}

.skills {
  margin-bottom: 60px;
  text-align: center;
  animation: fadeInUp 1s ease-out 0.3s backwards;
}

.skills h2, .contact h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #222;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.tag {
  background: rgba(0, 0, 0, 0.05);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #333;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0,0,0,0.05);
}

.tag:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.contact {
  text-align: center;
  animation: fadeInUp 1s ease-out 0.6s backwards;
}

.contact p {
  font-size: 1.1rem;
  color: #555;
  margin: 8px 0;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 响应式调整 */
@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }
  .subtitle {
    font-size: 1.2rem;
  }
}
</style>
