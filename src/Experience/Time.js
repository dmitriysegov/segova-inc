import { gsap } from '../plugins/gsap.js'

export default class Time {
    constructor() {
        this.current = performance.now()
        this.elapsed = 0
        this.callbacks = new Set()
        this.running = false
        this.tick = this.tick.bind(this)
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this)

        document.addEventListener('visibilitychange', this.handleVisibilityChange)
        this.start()
    }

    on(callback) {
        this.callbacks.add(callback)
        return () => this.callbacks.delete(callback)
    }

    start() {
        if (this.running) return
        this.running = true
        this.current = performance.now()
        gsap.ticker.add(this.tick)
    }

    stop() {
        this.running = false
        gsap.ticker.remove(this.tick)
    }

    tick() {
        if (!this.running) return
        const now = performance.now()
        const delta = Math.min((now - this.current) / 1000, 0.1)
        this.current = now
        this.elapsed += delta
        this.callbacks.forEach((callback) => callback(delta, this.elapsed))
    }

    handleVisibilityChange() {
        document.hidden ? this.stop() : this.start()
    }

    destroy() {
        this.stop()
        document.removeEventListener('visibilitychange', this.handleVisibilityChange)
        this.callbacks.clear()
    }
}
