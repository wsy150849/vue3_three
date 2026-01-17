import * as THREE from 'three'
import type { GeometryConfig } from '../config/types'

export function createGeometry(config: GeometryConfig): THREE.BufferGeometry {
  if (config.type === 'sphere') {
    return new THREE.SphereGeometry(config.size.radius!, 32, 32)
  }

  return new THREE.BoxGeometry(
    config.size.x!,
    config.size.y!,
    config.size.z!
  )
}
