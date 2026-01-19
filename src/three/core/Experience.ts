import * as THREE from 'three'
import { Camera } from './Camera'
import { Renderer } from './Renderer'
import { Time } from './Time'
import type { IWorld } from '../worlds/IWorld'
import { OrbitControlsEntity } from '../entities/OrbitControlsEntity'


export class Experience {
    static instance: Experience | null = null
    scene = new THREE.Scene()
    width = window.innerWidth
    height = window.innerHeight
    camera?: Camera
    renderer?: Renderer
    time?: Time
    world?: IWorld
    controls?: OrbitControlsEntity
    private canvas?: HTMLCanvasElement
    private tickCallback?: (dt: number) => void

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.scene.background = new THREE.Color(0x000000)
        this.scene = new THREE.Scene()
        this.camera = new Camera(this)
        this.renderer = new Renderer(this, canvas)
        this.time = new Time()
        this.tickCallback = dt => {
            this.world?.update(dt)
            this.renderer?.update()
        }
        this.time.on('tick', this.tickCallback)
        this.controls = new OrbitControlsEntity(this.camera.camera, this.renderer.renderer.domElement)
        this.controls.controls.addEventListener('change', () => {
            this.renderer?.update()
        })
    }

    async setWorld(world: IWorld) {
        this.world?.exit()
        this.world = world
        if (world.setExperience) {
            world.setExperience(this)
        }
        await world.enter()
    }

    dispose() {
        this.world?.exit()
        if (this.time && this.tickCallback) {
            this.time.off('tick', this.tickCallback)
        }
        this.controls?.dispose()
        this.renderer?.dispose()
        this.camera?.dispose()
        this.scene.clear()

        // 移除 canvas 元素
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas)
        }

        // 清除单例实例
        Experience.instance = null
    }
}


