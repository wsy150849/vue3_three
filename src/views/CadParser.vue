<template>
  <div class="page-container">
    <div class="controls">
      <input type="file" name="" id="fileInput" accept=".dxf" />
      <button @click="parseDxfFile()">解析DXF文件</button>
      <button @click="clearScene()" class="clear-btn">清除场景</button>
    </div>
    <div id="canvas-container" ref="canvasContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DxfParser from 'dxf-parser';
import * as THREE from 'three';
import { Experience } from '../three/core/Experience';

const canvasContainer = ref<HTMLDivElement>();
let experience: Experience | null = null;

onMounted(() => {
  initThreeScene();
});

const initThreeScene = () => {
  if (!canvasContainer.value) return;

  const canvas = document.createElement('canvas');
  canvasContainer.value.appendChild(canvas);

  experience = new Experience(canvas);
};

const parseDxfFile = () => {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  const file = fileInput.files?.[0];
  console.log('file:', file);

  if (file) {
    // 判断是dxf文件还是dwg文件
    if (file.name.endsWith('.dxf')) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event) => {
        const dxf = event.target?.result as string;

        const parser = new DxfParser();
        try {
          const dxfDoc = parser.parseSync(dxf);
          console.log('DXF解析成功:', dxfDoc);
          renderDxfToThree(dxfDoc);
        } catch (error) {
          console.error('DXF解析失败:', error);
          alert('DXF文件解析失败，请检查文件格式');
        }
      }
    } else if (file.name.endsWith('.dwg')) {
      // DWG文件可由后端解析，前端只需提供接口即可
      alert('DWG文件暂不支持解析');
    }
  }
};

const renderDxfToThree = (dxfDoc: any) => {
  if (!experience) return;

  // 清除之前的场景内容
  clearScene();

  const entities = dxfDoc.entities || [];
  console.log('解析到的实体数量:', entities.length);
  console.log('实体类型列表:', entities.map((e: any) => e.type));
  console.log('TEXT实体:', entities.filter((e: any) => e.type === 'TEXT'));

  const group = new THREE.Group();

  // 计算场景边界，用于居中和缩放
  const bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };

  entities.forEach((entity: any) => {
    if (entity.vertices) {
      entity.vertices.forEach((v: any) => {
        bounds.minX = Math.min(bounds.minX, v.x);
        bounds.minY = Math.min(bounds.minY, v.y);
        bounds.maxX = Math.max(bounds.maxX, v.x);
        bounds.maxY = Math.max(bounds.maxY, v.y);
      });
    }
  });

  // 计算中心点和缩放比例
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const maxDimension = Math.max(width, height) || 1;
  const scale = 20 / maxDimension; // 缩放到合适的尺寸

  entities.forEach((entity: any) => {
    if (entity.type === 'LINE' && entity.vertices) {
      const points = entity.vertices.map((v: any) => new THREE.Vector3(
        (v.x - centerX) * scale,
        (v.y - centerY) * scale,
        0
      ));

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: entity.color ? convertColor(entity.color) : 0xffffff });
      const line = new THREE.Line(geometry, material);
      group.add(line);
    }

    if (entity.type === 'LWPOLYLINE' && entity.vertices) {
      const points = entity.vertices.map((v: any) => new THREE.Vector3(
        (v.x - centerX) * scale,
        (v.y - centerY) * scale,
        0
      ));

      if (entity.closed) {
        // 闭合多边形
        points.push(points[0].clone());
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: entity.color ? convertColor(entity.color) : 0xffffff });
      const line = new THREE.Line(geometry, material);
      group.add(line);
    }

    if (entity.type === 'CIRCLE') {
      const geometry = new THREE.CircleGeometry(entity.radius * scale, 64);
      const material = new THREE.LineBasicMaterial({ color: entity.color ? convertColor(entity.color) : 0xffffff });
      const circle = new THREE.LineLoop(geometry, material);
      circle.position.set(
        (entity.center.x - centerX) * scale,
        (entity.center.y - centerY) * scale,
        0
      );
      group.add(circle);
    }

    if (entity.type === 'ARC') {
      const curve = new THREE.EllipseCurve(
        (entity.center.x - centerX) * scale,
        (entity.center.y - centerY) * scale,
        entity.radius * scale,
        entity.radius * scale,
        entity.startAngle,
        entity.endAngle,
        false,
        0
      );

      const points = curve.getPoints(64);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: entity.color ? convertColor(entity.color) : 0xffffff });
      const arc = new THREE.Line(geometry, material);
      group.add(arc);
    }

    if (entity.type === 'POLYLINE' && entity.vertices) {
      const points = entity.vertices.map((v: any) => new THREE.Vector3(
        (v.x - centerX) * scale,
        (v.y - centerY) * scale,
        0
      ));

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: entity.color ? convertColor(entity.color) : 0xffffff });
      const line = new THREE.Line(geometry, material);
      group.add(line);
    }

    if (entity.type === 'TEXT' && entity.text) {
      console.log('发现TEXT实体:', entity);
      const textSprite = createTextSprite(
        entity.text,
        entity.color ? convertColor(entity.color) : 0xffffff,
        entity.height ? entity.height * scale * 0.5 : 1
      );



      // 根据文本内容自动计算房间中心点
      const roomCenter = { x: entity.startPoint.x, y: entity.startPoint.y };
      let textX, textY;

      if (roomCenter.x !== null && roomCenter.y !== null) {
        // 使用预定义的房间中心点
        textX = roomCenter.x;
        textY = roomCenter.y;
      } else {
        // 使用原始位置
        textX = entity.x || entity.position?.x || 0;
        textY = entity.y || entity.position?.y || 0;
      }

      textSprite.position.set(
        (textX - centerX) * scale,
        (textY - centerY) * scale,
        0
      );
      group.add(textSprite);
      console.log('文本精灵已添加:', entity.text, '位置:', textSprite.position);
    }

    if (entity.type === 'MTEXT' && entity.text) {
      // 处理多行文本，移除可能的格式标记
      const cleanText = entity.text.replace(/\\P/g, '\n').replace(/\\[A-Za-z0-9.;]+/g, '');
      const textSprite = createTextSprite(
        cleanText,
        entity.color ? convertColor(entity.color) : 0xffffff,
        entity.height ? entity.height * scale * 0.5 : 1
      );

      textSprite.position.set(
        (entity.position?.x || 0 - centerX) * scale,
        (entity.position?.y || 0 - centerY) * scale,
        0
      );
      group.add(textSprite);
    }
  });

  experience.scene.add(group);

  // 调整相机位置
  if (experience.camera?.camera) {
    experience.camera.camera.position.set(0, 0, 30);
    experience.camera.camera.lookAt(0, 0, 0);
  }

  console.log(`成功绘制 ${entities.length} 个CAD实体`);
};

// 创建文本精灵
const createTextSprite = (text: string, color: number, fontSize: number = 1): THREE.Sprite => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    console.error('无法创建canvas上下文');
    // 如果canvas不可用，返回一个简单的对象
    const material = new THREE.SpriteMaterial({ color });
    return new THREE.Sprite(material);
  }

  console.log('创建文本精灵:', text, '颜色:', color, '大小:', fontSize);

  // 根据文本长度调整画布大小
  const lines = text.split('\n');
  const maxWidth = Math.max(...lines.map(line => line.length));
  const lineHeight = fontSize * 1.5;
  canvas.width = Math.max(256, maxWidth * fontSize * 8);
  canvas.height = Math.max(64, lines.length * lineHeight);

  // 设置字体和样式
  const adjustedFontSize = Math.max(fontSize * 8, 16);
  context.font = `bold ${adjustedFontSize}px Arial, sans-serif`;
  context.fillStyle = '#' + color.toString(16).padStart(6, '0');
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // 添加阴影以提高可读性
  context.shadowColor = 'rgba(0, 0, 0, 0.8)';
  context.shadowBlur = 4;
  context.shadowOffsetX = 2;
  context.shadowOffsetY = 2;

  // 绘制文本
  lines.forEach((line, index) => {
    const y = (index + 0.5) * lineHeight + (canvas.height - lines.length * lineHeight) / 2;
    context.fillText(line, canvas.width / 2, y);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false  // 确保文本始终在最上层
  });
  const sprite = new THREE.Sprite(material);

  // 设置精灵大小 - 增大尺寸以增强可见性
  sprite.scale.set(canvas.width / 30, canvas.height / 30, 1);
  sprite.renderOrder = 1000;  // 确保最后渲染

  return sprite;
};

// 将CAD颜色索引转换为RGB值
const convertColor = (colorIndex: number): number => {
  const colors: { [key: number]: number } = {
    0: 0x000000, 1: 0xff0000, 2: 0xffff00, 3: 0x00ff00,
    4: 0x00ffff, 5: 0x0000ff, 6: 0xff00ff, 7: 0xffffff,
    8: 0x414141, 9: 0x808080
  };
  return colors[colorIndex] || 0xffffff;
};

const clearScene = () => {
  if (!experience) return;

  // 移除场景中所有子对象（除了相机）
  const children = [...experience.scene.children];
  children.forEach((child) => {
    if (!(child instanceof THREE.PerspectiveCamera) && !(child instanceof THREE.OrthographicCamera)) {
      experience?.scene.remove(child);
    }
  });
};
</script>

<style scoped>
.page-container {
  padding-top: 80px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: inherit;
}

.controls {
  margin: 10px 0;
  display: flex;
  gap: 10px;
  align-items: center;
}

.controls input[type="file"] {
  padding: 8px;
}

.controls button {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.controls button:hover {
  background: #33a06f;
}

.clear-btn {
  background: #f56c6c !important;
}

.clear-btn:hover {
  background: #e65555 !important;
}

#canvas-container {
  width: 100%;
  height: calc(100vh - 140px);
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

#canvas-container canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
