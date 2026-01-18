import * as THREE from 'three'
import type { MaterialConfig } from '../config/types'

export function createMaterial(config: MaterialConfig): THREE.Material {
  switch (config.type) {
    case 'standard':
      return new THREE.MeshStandardMaterial({
        color: config.color ?? 0xffffff,
        metalness: config.metalness ?? 0,
        roughness: config.roughness ?? 0.5
      })
    case 'phong':
      return new THREE.MeshPhongMaterial({
        color: config.color ?? 0xffffff,
        shininess: config.shininess ?? 30,
      })
    case 'physical':
      return new THREE.MeshStandardMaterial({
        color: config.color ?? 0xffffff,
        metalness: config.metalness ?? 0,
        roughness: config.roughness ?? 0.5
      })
    case 'lambert':
      return new THREE.MeshLambertMaterial({
        color: config.color ?? 0xffffff,
      })
    default:
      return new THREE.MeshBasicMaterial({
        color: config.color ?? 0xffffff,
      })
  }
}