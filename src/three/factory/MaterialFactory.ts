import * as THREE from 'three'
import type { MaterialConfig } from '../config/types'

export function createMaterial(config: MaterialConfig): THREE.Material {
  return new THREE.MeshStandardMaterial({
    color: config.color ?? 0xffffff,
    metalness: config.metalness ?? 0,
    roughness: config.roughness ?? 0.5
  })
}
