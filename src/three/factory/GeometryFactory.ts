import * as THREE from 'three'
import type { GeometryConfig } from '../config/types'

export function createGeometry(config: GeometryConfig): THREE.BufferGeometry {
  switch (config.type) {
    case 'box':
      return new THREE.BoxGeometry(
        config.size.x!,
        config.size.y!,
        config.size.z!
      )

    case 'sphere':
      return new THREE.SphereGeometry(
        config.size.radius!,
        config.size.widthSegments!,
        config.size.heightSegments!
      )

    case 'cylinder':
      return new THREE.CylinderGeometry(
        config.size.radiusTop!,
        config.size.radiusBottom!,
        config.size.height!,
        config.size.radialSegments! || 64,
        config.size.heightSegments!  || 64,
        config.size.openEnded! || false,
        32
      )

    case 'plane':
      return new THREE.PlaneGeometry(
        config.size.x!,
        config.size.y!,
        config.size.widthSegments!,
        config.size.heightSegments!
      )

    case 'cone':
      return new THREE.ConeGeometry(
        config.size.radius!,
        config.size.height!,
        32
      )

    default:
      throw new Error(`Unknown geometry type: ${config.type}`)
  }
}