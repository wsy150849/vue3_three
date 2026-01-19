import * as THREE from 'three'
import type { MaterialConfig } from '../config/types'

export function createMaterial(config: MaterialConfig): THREE.Material {
  const materialConfig: any = {
    color: config.color ?? 0xffffff
  }

  switch (config.type) {
    case 'standard':
      materialConfig.metalness = config.metalness ?? 0
      materialConfig.roughness = config.roughness ?? 0.5
      if (config.side) materialConfig.side = config.side
      return new THREE.MeshStandardMaterial(materialConfig)
    case 'phong':
      materialConfig.shininess = config.shininess ?? 30
      if (config.side) materialConfig.side = config.side
      return new THREE.MeshPhongMaterial(materialConfig)
    case 'physical':
      materialConfig.metalness = config.metalness ?? 0
      materialConfig.roughness = config.roughness ?? 0.5
      if (config.side) materialConfig.side = config.side
      return new THREE.MeshPhysicalMaterial(materialConfig)
    case 'lambert':
      if (config.side) materialConfig.side = config.side
      return new THREE.MeshLambertMaterial(materialConfig)
    default:
      if (config.side) materialConfig.side = config.side
      return new THREE.MeshBasicMaterial(materialConfig)
  }
}