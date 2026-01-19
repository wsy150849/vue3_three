import type { Experience } from '../core/Experience'

export type IWorld = {
  enter(): Promise<void> | void
  update(dt: number): void
  exit(): void
  setExperience?(experience: Experience): void
}
