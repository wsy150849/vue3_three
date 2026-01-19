import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import type { GeometryConfig } from '../config/types'
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js'
const loader = new FontLoader();
// promisify font loading
function loadFont(url: string) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });

}

async function text({ text = 'three.js', size = 3.0, depth = .2, curveSegments = 12, bevelEnabled = true, bevelThickness = .15, bevelSize = .3, bevelSegments = 5 }) {
  const font = await loadFont('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json') as Font;
  return new TextGeometry(text, {
    font: font,
    size: size,
    depth: depth,
    curveSegments: curveSegments,
    bevelEnabled: bevelEnabled,
    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelSegments: bevelSegments

  });

}

export async function createGeometry(config: GeometryConfig): Promise<THREE.BufferGeometry> {
  switch (config.type) {
    case 'box':
      return new THREE.BoxGeometry(
        config.size.width!,
        config.size.height!,
        config.size.depth!
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
        config.size.heightSegments! || 64,
        config.size.openEnded! || false,
        32
      )

    case 'plane':
      return new THREE.PlaneGeometry(
        config.size.width!,
        config.size.height!,
        config.size.widthSegments!,
        config.size.heightSegments!
      )

    case 'cone':
      return new THREE.ConeGeometry(
        config.size.radius!,
        config.size.height!,
        config.size.radialSegments! || 32
      )

    case 'circle':
      return new THREE.CircleGeometry(
        config.size.radius!,
        50
      )

    case 'text':
      return await text(config.size)
    default:
      throw new Error(`Unknown geometry type: ${config.type}`)
  }
}