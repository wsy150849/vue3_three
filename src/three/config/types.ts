/**
 * BoxGeometry：立方体，是最基础的几何体之一，用来创建矩形物体。
 * SphereGeometry：球体，用来创建球形物体。
 * PlaneGeometry：平面几何体，常用来做地面或背景。
 * CylinderGeometry：圆柱体，常用来做柱子、管道等形状。
 * ConeGeometry：圆锥体，常用来做锥形的物体。
 */

export type GeometryConfig = {
  type: 'box' | 'sphere' | 'cylinder' | 'plane' | 'cone'
  size: {
    radius?: number
    x?: number
    y?: number
    z?: number
    height?: number
    widthSegments?: number
    heightSegments?: number
    radiusTop?: number
    radiusBottom?: number
    radialSegments?: number
    openEnded?: boolean
  }
}
/**
 * 材质类型：
 * MeshBasicMaterial：最基础的材质，不受光照影响。适用于简单的显示和调试。
 * MeshLambertMaterial：简单的材质，会对光源做响应，但没有高光效果。适合大多数不需要过多光照计算的场景。
 * MeshPhongMaterial：会产生高光反射，适合用来制作光滑的表面（如金属或水面）。
 * MeshStandardMaterial：现代的物理材质，支持更逼真的光照效果，适用于更真实的渲染。
 * MeshPhysicalMaterial：继承自 MeshStandardMaterial，增加了透明度、反射等更多物理属性，适合制作复杂的材质效果（如水面、玻璃、金属等）。
 */
export type MaterialConfig = {
  type: 'standard' | 'basic' | 'phong' | 'physical' | 'lambert'
  color?: number
  metalness?: number
  roughness?: number
  shininess?: number
}
