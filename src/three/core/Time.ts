import mitt from 'mitt'

export class Time {
  emitter = mitt()
  last = performance.now()

  constructor() {
    this.tick()
  }

  tick() {
    const now = performance.now()
    const delta = (now - this.last) / 1000
    this.last = now

    this.emitter.emit('tick', delta)
    requestAnimationFrame(() => this.tick())
  }

  on(event: 'tick', cb: (dt: number) => void) {
    this.emitter.on(event, cb)
  }
}
