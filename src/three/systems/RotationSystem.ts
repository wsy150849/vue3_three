import { GeometryEntity } from '../entities/GeometryEntity'

export class RotationSystem {
  update(entities: GeometryEntity[], dt: number) {
    entities.forEach(e => {
      e.id == 'sun' && (e.group.rotation.y += 0.5 * dt)
    })
  }
}
