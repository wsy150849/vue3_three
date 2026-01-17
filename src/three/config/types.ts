export type GeometryConfig = {
  type: 'box' | 'sphere' | 'cylinder' | 'custom'
  size: {
    radius?: number
    x?: number
    y?: number
    z?: number
  }
}

export type MaterialConfig = {
  type: 'standard' | 'basic' | 'phong'
  color?: number
  metalness?: number
  roughness?: number
}
