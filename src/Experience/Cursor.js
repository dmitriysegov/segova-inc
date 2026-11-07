export default class Cursor {
    constructor() {
        this.x = 0
        this.y = 0
        this.isMobile = window.matchMedia('(pointer: coarse)').matches
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleOrientation = this.handleOrientation.bind(this)
        this.requestOrientation = this.requestOrientation.bind(this)

        this.isMobile ? this.initGyroscope() : this.initMouse()
    }

    initMouse() {
        window.addEventListener('pointermove', this.handleMouseMove, { passive: true })
    }

    handleMouseMove(event) {
        this.x = event.clientX / window.innerWidth - 0.5
        this.y = event.clientY / window.innerHeight - 0.5
    }

    initGyroscope() {
        if (typeof DeviceOrientationEvent === 'undefined') return
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            document.addEventListener('pointerdown', this.requestOrientation, { once: true, passive: true })
        } else {
            this.addOrientationListener()
        }
    }

    requestOrientation() {
        DeviceOrientationEvent.requestPermission()
            .then((result) => result === 'granted' && this.addOrientationListener())
            .catch(() => {})
    }

    addOrientationListener() {
        window.addEventListener('deviceorientation', this.handleOrientation, { passive: true })
    }

    handleOrientation(event) {
        this.x = Math.max(-0.5, Math.min(0.5, (event.gamma || 0) / 90))
        this.y = Math.max(-0.5, Math.min(0.5, ((event.beta || 45) - 45) / 90))
    }

    destroy() {
        window.removeEventListener('pointermove', this.handleMouseMove)
        window.removeEventListener('deviceorientation', this.handleOrientation)
        document.removeEventListener('pointerdown', this.requestOrientation)
    }
}
