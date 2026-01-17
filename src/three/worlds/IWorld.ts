import type { Experience } from '../core/Experience'

export type IWorld = {
  enter(): void
  update(dt: number): void
  exit(): void
  setExperience?(experience: Experience): void
}
