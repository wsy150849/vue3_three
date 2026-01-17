import * as THREE from 'three'
import { Experience } from '../core/Experience'
import { GeometryEntity } from '../entities/GeometryEntity'
import { RotationSystem } from '../systems/RotationSystem'
import type { IWorld } from './IWorld'

export class SolarWorld implements IWorld {
    root = new THREE.Group()
    orbit = new THREE.Group()
    entities: GeometryEntity[] = []
    rotationSystem = new RotationSystem()
    exp?: Experience

    setExperience(experience: Experience) {
        this.exp = experience
    }

    enter() {
        if (!this.exp) return

        this.exp.scene.add(this.root)

        // 光
        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(5, 5, 5)
        this.root.add(light)

        this.root.add(new THREE.AmbientLight(0xffffff, 0.3))

        const sun = new GeometryEntity(
            { type: 'sphere', size: { radius: 1 } },
            { type: 'standard', color: 0xffff00 },
            { size: 5, status: true }
        )
        const help1 = new THREE.AxesHelper(5)
        sun.group.add(help1)

        const planet = new GeometryEntity(
            { type: 'sphere', size: { radius: 0.4 } },
            { type: 'standard', color: 0x3366ff },
            { size: 2, status: true }
        )
        const help2 = new THREE.AxesHelper(2)
        planet.group.add(help2)

        sun.enter(this.root)
        planet.enter(this.orbit)
        planet.group.position.x = 3

        this.orbit.position.set(0, 0, 0)
        this.root.add(this.orbit)

        this.entities.push(sun, planet)
    }

    update(dt: number) {
        this.orbit.rotation.y += dt * 0.5   // 公转
        this.rotationSystem.update(this.entities, dt)
    }

    exit() {
        this.entities.forEach(e => e.exit())
        if (this.exp) {
            this.exp.scene.remove(this.root)
        }
    }
}
