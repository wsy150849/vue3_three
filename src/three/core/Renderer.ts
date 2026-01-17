import * as THREE from 'three'
import { Experience } from './Experience'

export class Renderer {
    renderer: THREE.WebGLRenderer
    constructor(experience: Experience, canvas: HTMLCanvasElement) {
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true
        })
        this.renderer.setSize(experience.width, experience.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        window.addEventListener('resize', () => {
            this.renderer.setSize(experience.width, experience.height)
        })
    }

    update() {
        this.renderer.render(Experience.instance.scene, Experience.instance.camera.camera)
    }
}