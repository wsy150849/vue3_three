import mitt from 'mitt'

export class Time {
  emitter = mitt()
  last = performance.now()
  private animationFrameId?: number
  private isRunning = true

  constructor() {
    this.tick()
  }

  tick() {
    if (!this.isRunning) return

    const now = performance.now()
    const delta = (now - this.last) / 1000
    this.last = now

    this.emitter.emit('tick', delta)
    this.animationFrameId = requestAnimationFrame(() => this.tick())
  }

  on(event: 'tick', cb: (dt: number) => void) {
    this.emitter.on(event, cb)
  }

  off(event: 'tick', cb: (dt: number) => void) {
    this.emitter.off(event, cb)
  }

  dispose() {
    this.isRunning = false
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }
    this.emitter.all.clear()
  }
}
