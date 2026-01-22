import * as THREE from 'three'
import type { IWorld } from './IWorld'
import { Experience } from '../core/Experience'
import { GeometryEntity } from '../entities/GeometryEntity'

export class CustomMaterialWorld implements IWorld {
    private exp?: Experience
    private entities: GeometryEntity[] = []
    private root = new THREE.Group()

    // 轨迹系统
    private trailMaxPoints = 40
    private trailPositions = new Float32Array(this.trailMaxPoints * 3)
    private trailLinePositions = new Float32Array(this.trailMaxPoints * 3) // 用于线条的有序位置
    private trailIndex = 0
    private trailMesh!: THREE.Line

    // 粒子系统
    private particleMaxCount = 100
    private particlePositions = new Float32Array(this.particleMaxCount * 3)
    private particleLife = new Float32Array(this.particleMaxCount)
    private particleVelocities = new Float32Array(this.particleMaxCount * 3)
    private particleSpawnTimes = new Float32Array(this.particleMaxCount) // 记录粒子应该重生的时间
    private particlePoints!: THREE.Points

    private targetPosition = new THREE.Vector3(0, 0, 0)
    private currentPosition = new THREE.Vector3(0, 0, 0)
    private lastMousePosition = new THREE.Vector3(0, 0, 0)
    private isMouseMoving = false
    private mouseStopTime = 0

    setExperience(experience: Experience): void {
        this.exp = experience
        if (this.exp) {
            this.setupMouseEvents()
        }
    }

    private setupMouseEvents(): void {
        if (!this.exp || !this.exp.renderer || !this.exp.camera) return

        window.addEventListener('mousemove', (e) => {
            // 直接使用屏幕归一化坐标（不进行投影转换）
            const rect = this.exp!.renderer!.renderer.domElement.getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
            const y = -((e.clientY - rect.top) / rect.height) * 2 + 1

            // 根据相机FOV和距离计算对应的世界坐标
            const camera = this.exp!.camera!.camera
            const fov = camera.fov * (Math.PI / 180)
            const distance = camera.position.z
            const aspect = rect.width / rect.height

            const height = 2 * Math.tan(fov / 2) * distance
            const width = height * aspect

            this.targetPosition.set(x * width / 2, y * height / 2, 0)

            // 检测鼠标是否在移动
            const moveDistance = this.targetPosition.distanceTo(this.lastMousePosition)
            if (moveDistance > 0.001) {
                this.isMouseMoving = true
                this.mouseStopTime = performance.now() / 1000
            }
            this.lastMousePosition.copy(this.targetPosition)
        })
    }

    async enter(): Promise<void> {
        if (!this.exp) return
        this.exp.scene.add(this.root)

        // 创建占满屏幕的背景
        const camera = this.exp.camera!.camera
        const fov = camera.fov * (Math.PI / 180)
        const distance = 10
        const height = 2 * Math.tan(fov / 2) * distance
        const width = height * (camera as THREE.PerspectiveCamera).aspect

        const bgEntity = new GeometryEntity(
            { type: 'plane', size: { width, height } },
            { type: 'basic', color: 0x1a1a2e },
            { size: 1, status: false }
        )
        await bgEntity.enter(this.root)
        bgEntity.group.position.z = -distance

        // 初始化轨迹
        for (let i = 0; i < this.trailMaxPoints; i++) {
            this.trailPositions[i * 3] = 0
            this.trailPositions[i * 3 + 1] = 0
            this.trailPositions[i * 3 + 2] = 0
            this.trailLinePositions[i * 3] = 0
            this.trailLinePositions[i * 3 + 1] = 0
            this.trailLinePositions[i * 3 + 2] = 0
        }

        // 创建轨迹线 - 使用自定义着色器实现彗星效果
        const trailGeometry = new THREE.BufferGeometry()
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(this.trailLinePositions, 3))

        // 添加距离属性用于着色器
        const trailDistances = new Float32Array(this.trailMaxPoints)
        for (let i = 0; i < this.trailMaxPoints; i++) {
            trailDistances[i] = i / (this.trailMaxPoints - 1) // 0是头部，1是尾部
        }
        trailGeometry.setAttribute('aDistance', new THREE.BufferAttribute(trailDistances, 1))

        const trailMaterial = new THREE.ShaderMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexShader: `
                attribute float aDistance;
                varying float vDistance;
                void main() {
                    vDistance = aDistance;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
                }
            `,
            fragmentShader: `
                varying float vDistance;
                void main() {
                    // 头部（距离0）亮白黄，尾部（距离1）淡紫
                    vec3 headColor = vec3(1.0, 1.0, 0.8);
                    vec3 tailColor = vec3(0.6, 0.3, 1.0);
                    vec3 color = mix(headColor, tailColor, vDistance);

                    // 透明度渐变：头部0.9，尾部0
                    float alpha = 0.9 * (1.0 - vDistance * vDistance);

                    gl_FragColor = vec4(color, alpha);
                }
            `
        })

        this.trailMesh = new THREE.Line(trailGeometry, trailMaterial)
        this.root.add(this.trailMesh)

        // 初始化粒子
        const initTime = performance.now() / 1000
        for (let i = 0; i < this.particleMaxCount; i++) {
            this.particlePositions[i * 3] = 0
            this.particlePositions[i * 3 + 1] = 0
            this.particlePositions[i * 3 + 2] = 0
            this.particleLife[i] = 1.0
            this.particleVelocities[i * 3] = 0
            this.particleVelocities[i * 3 + 1] = 0
            this.particleVelocities[i * 3 + 2] = 0
            // 错开粒子的重生时间，实现持续掉落（每个粒子间隔0.003秒）
            this.particleSpawnTimes[i] = initTime - (i * 0.003)
        }

        // 创建粒子系统
        const particleGeometry = new THREE.BufferGeometry()
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3))
        particleGeometry.setAttribute('aLife', new THREE.BufferAttribute(this.particleLife, 1))

        const particleMaterial = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexShader: `
                attribute float aLife;
                varying float vLife;
                void main() {
                    vLife = aLife;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1);

                    // 头部小，尾部大
                    float size = 1.0 + vLife * 3.0;
                    gl_PointSize = size * (200.0 / -mvPosition.z);

                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying float vLife;
                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float coreMask = 1.0 - smoothstep(0.0, 0.5, dist);

                    // 尾部大但淡，头部小但亮
                    float alpha = (0.9 - vLife * 0.8) * coreMask;

                    vec3 color = mix(
                        vec3(1.0, 0.9, 0.3),
                        vec3(0.5, 0.3, 1.0),
                        vLife
                    );

                    gl_FragColor = vec4(color, alpha);
                }
            `
        })

        this.particlePoints = new THREE.Points(particleGeometry, particleMaterial)
        this.root.add(this.particlePoints)
    }

    update(dt: number): void {
        // 直接使用鼠标目标位置，让轨迹头部紧贴鼠标
        this.currentPosition.copy(this.targetPosition)

        // 更新轨迹 - 按顺序连接点
        this.trailIndex = (this.trailIndex + 1) % this.trailMaxPoints
        this.trailPositions[this.trailIndex * 3] = this.currentPosition.x
        this.trailPositions[this.trailIndex * 3 + 1] = this.currentPosition.y
        this.trailPositions[this.trailIndex * 3 + 2] = this.currentPosition.z

        // 将轨迹点按正确顺序复制到 linePositions（从旧到新）
        for (let i = 0; i < this.trailMaxPoints; i++) {
            const sourceIdx = ((this.trailIndex - i + this.trailMaxPoints) % this.trailMaxPoints)
            this.trailLinePositions[i * 3] = this.trailPositions[sourceIdx * 3]!
            this.trailLinePositions[i * 3 + 1] = this.trailPositions[sourceIdx * 3 + 1]!
            this.trailLinePositions[i * 3 + 2] = this.trailPositions[sourceIdx * 3 + 2]!
        }

        this.trailMesh.geometry.attributes.position!.needsUpdate = true

        // 更新粒子
        const positions = this.particlePositions as any
        const life = this.particleLife as any
        const velocities = this.particleVelocities as any

        // 检测鼠标是否停止
        const currentTime = performance.now() / 1000
        const mouseStoppedDuration = currentTime - this.mouseStopTime

        for (let i = 0; i < this.particleMaxCount; i++) {
            if (life[i] < 1.0) {
                // 应用速度
                positions[i * 3] += velocities[i * 3] * dt * 60
                positions[i * 3 + 1] += velocities[i * 3 + 1] * dt * 60
                positions[i * 3 + 2] += velocities[i * 3 + 2] * dt * 60

                // 重力效果
                velocities[i * 3 + 1] -= 3.0 * dt

                // 增加生命周期
                life[i] += dt * 1.5
                if (life[i] > 1.0) {
                    life[i] = 1.0
                    // 重置重生计时器，避免积累
                    this.particleSpawnTimes[i] = currentTime
                }
            } else {
                // 鼠标停止超过0.5秒后不再生成新粒子
                if (mouseStoppedDuration > 0.5) {
                    continue
                }

                // 检查是否到了重生时间
                if (currentTime - this.particleSpawnTimes[i] < 0.003) {
                    continue
                }

                // 只在靠近鼠标的轨迹段生成粒子（最新的前30个点）
                const trailOffset = Math.floor(Math.random() * 30)
                const trailPointIndex = (this.trailIndex - trailOffset + this.trailMaxPoints) % this.trailMaxPoints

                positions[i * 3] = this.trailPositions[trailPointIndex * 3]!
                positions[i * 3 + 1] = this.trailPositions[trailPointIndex * 3 + 1]!
                positions[i * 3 + 2] = this.trailPositions[trailPointIndex * 3 + 2]!

                // 向下掉落的速度
                velocities[i * 3] = (Math.random() - 0.5) * 0.3
                velocities[i * 3 + 1] = -(0.5 + Math.random() * 0.5)
                velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3

                life[i] = 0.0
            }
        }

        this.particlePoints.geometry.attributes.position!.needsUpdate = true
        this.particlePoints.geometry.attributes.aLife!.needsUpdate = true
    }

    exit(): void {
        this.entities.forEach(e => e.exit())
        if (this.exp) {
            this.exp.scene.remove(this.root)
        }
    }
}
