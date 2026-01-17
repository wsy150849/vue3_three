import * as THREE from 'three'
import { Experience } from './Experience'

export class Camera {
    camera: THREE.PerspectiveCamera
    constructor(experience: Experience) {
        this.camera = new THREE.PerspectiveCamera(75, experience.width / experience.height, 0.1, 1000)
        this.camera.position.set(0, 0, 5)
        this.camera.lookAt(0, 0, 0)
        experience.scene.add(this.camera)

        window.addEventListener('resize', () => {
            this.camera.aspect = experience.width / experience.height
            this.camera.updateProjectionMatrix()
        })
    }
}