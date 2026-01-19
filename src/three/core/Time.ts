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

  /**
   * 获取当前真实时间（秒）
   * 返回格式：0-86399（一天的总秒数）
   */
  getRealTimeSeconds(): number {
    const now = new Date()
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000
  }

  /**
   * 获取时钟指针角度
   * @return { hours: 弧度, minutes: 弧度, seconds: 弧度 }
   */
  getClockAngles(): { hours: number, minutes: number, seconds: number } {
    const now = new Date()
    const hours = now.getHours() % 12
    const minutes = now.getMinutes()
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000

    // 计算角度（12点方向为0，顺时针为正方向）
    // 由于 Three.js 的 rotation.z 正值是逆时针，所以在 ClockWorld 中会取负值
    // 时针：每小时30度，每分钟0.5度
    const hoursAngle = (hours + minutes / 60) * Math.PI / 6

    // 分针：每分钟6度，每秒0.1度
    const minutesAngle = (minutes + seconds / 60) * Math.PI / 30

    // 秒针：每秒6度
    const secondsAngle = seconds * Math.PI / 30

    return { hours: hoursAngle, minutes: minutesAngle, seconds: secondsAngle }
  }

  on(event: 'tick', cb: (dt: number) => void) {
    this.emitter.on(event, cb as any)
  }

  off(event: 'tick', cb: (dt: number) => void) {
    this.emitter.off(event, cb as any)
  }

  dispose() {
    this.isRunning = false
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }
    this.emitter.all.clear()
  }
}
