import * as THREE from 'three'
import { Camera } from './Camera'
import { Renderer } from './Renderer'
import { Time } from './Time'
import type { IWorld } from '../worlds/IWorld'
import { OrbitControlsEntity } from '../entities/OrbitControlsEntity'


export class Experience {
    static instance: Experience
    scene = new THREE.Scene()
    width = window.innerWidth
    height = window.innerHeight
    camera?: Camera
    renderer?: Renderer
    time?: Time
    world?: IWorld
    controls?: OrbitControlsEntity
    constructor(canvas: HTMLCanvasElement) {
        if (Experience.instance) return Experience.instance
        Experience.instance = this
        this.scene.background = new THREE.Color(0x000000)
        this.scene = new THREE.Scene()
        this.camera = new Camera(this)
        this.renderer = new Renderer(this, canvas)
        this.time = new Time()
        this.time.on('tick', dt => {
            this.world?.update(dt)
            this.renderer?.update()
        })
        this.controls = new OrbitControlsEntity(this.camera.camera, this.renderer.renderer.domElement)
        this.controls.controls.addEventListener('change', () => {
            this.renderer?.update()
        })
    }
    setWorld(world: IWorld) {
        this.world?.exit()
        this.world = world
        world.enter()
    }
}


