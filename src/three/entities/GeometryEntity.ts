import * as THREE from 'three'
import type { GeometryConfig, MaterialConfig } from '../config/types'
import { createGeometry } from '../factory/GeometryFactory'
import { createMaterial } from '../factory/MaterialFactory'

type HelpConfig = {
    size: number,
    status: Boolean
}

export class GeometryEntity {
    group = new THREE.Group()
    mesh!: THREE.Mesh
    id?: string


    constructor(
        private geometryConfig: GeometryConfig,
        private materialConfig: MaterialConfig,
        private helpConfig: HelpConfig,
        id?: string
    ) { 
        this.id = id
    }

    enter(parent: THREE.Group) {
        const geometry = createGeometry(this.geometryConfig)
        const material = createMaterial(this.materialConfig)

        this.mesh = new THREE.Mesh(geometry, material)
        if (this.helpConfig.status) {
            const help = new THREE.AxesHelper(this.helpConfig.size)
            this.group.add(help)
        }
        this.group.add(this.mesh)
        this.group.position.set(0, 0, 0)
        parent.add(this.group)
    }

    exit() {
        this.mesh.geometry.dispose()
            ; (this.mesh.material as THREE.Material).dispose()
    }
    update(dt: number) {
        // this.group.rotation.y += 0.5 * dt
    }
}
