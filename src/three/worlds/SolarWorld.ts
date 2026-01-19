import * as THREE from 'three'
import { Experience } from '../core/Experience'
import { GeometryEntity } from '../entities/GeometryEntity'
import { RotationSystem } from '../systems/RotationSystem'
import type { IWorld } from './IWorld'

export class SolarWorld implements IWorld {
    root = new THREE.Group()
    orbit = new THREE.Group()
    rocketOrbit = new THREE.Group()
    rocketGroup = new THREE.Group()
    entities: GeometryEntity[] = []
    rotationSystem = new RotationSystem()
    exp?: Experience

    setExperience(experience: Experience) {
        this.exp = experience
    }

    async enter(): Promise<void> {
        if (!this.exp) return

        this.exp.scene.add(this.root)

        // 光
        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(5, 5, 5)
        this.root.add(light)

        this.root.add(new THREE.AmbientLight(0xffffff, 0.3))


        const sun = new GeometryEntity(
            // 'sun',
            { type: 'sphere', size: { radius: 1 } },
            { type: 'standard', color: 0xffff00 },
            { size: 2, status: true },
            'sun'
        )

        const planet = new GeometryEntity(
            // 'planet',
            { type: 'sphere', size: { radius: 0.2 } },
            { type: 'standard', color: 0x3366ff },
            { size: 0.5, status: true },
            'planet'
        )

        sun.enter(this.root)
        planet.enter(this.orbit)
        planet.group.position.x = 4

        // 火箭轨道
        planet.group.add(this.rocketOrbit)

        // 火箭
        this.rocketOrbit.add(this.rocketGroup)
        this.rocketGroup.position.y = 0.5
        const rocketBody = new GeometryEntity(
            {
                type: 'cylinder', size: {
                    radiusTop: 0.02,
                    radiusBottom: 0.04,
                    height: 0.3,
                }
            },
            { type: 'standard', color: 0xff0000 },
            { size: 0.2, status: true }
        )
        rocketBody.group.rotation.x = Math.PI / 2
        rocketBody.enter(this.rocketGroup)
        const rocketHead = new GeometryEntity(
            { type: 'cone', size: { radius: 0.04, height: 0.1 } },
            { type: 'standard', color: 0xff00ff },
            { size: 0.2, status: true }
        )
        rocketHead.group.rotation.x = Math.PI / 2
        rocketHead.enter(this.rocketGroup)
        rocketHead.group.position.z = 0.15

        this.orbit.position.set(0, 0, 0)
        this.root.add(this.orbit)

        this.entities.push(sun, planet, rocketBody, rocketHead)
    }

    update(dt: number) {
        this.orbit.rotation.y += dt * 0.5   // 公转
        this.rocketOrbit.rotation.x += dt * 1 // 火箭绕行星上下旋转
        this.rotationSystem.update(this.entities, dt)
    }

    exit() {
        this.entities.forEach(e => e.exit())
        if (this.exp) {
            this.exp.scene.remove(this.root)
        }
    }
}
