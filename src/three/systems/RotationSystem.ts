import { GeometryEntity } from '../entities/GeometryEntity'

export class RotationSystem {
  update(entities: GeometryEntity[], dt: number) {
    entities.forEach(e => {
      e.group.rotation.y += dt
    })
  }
}
