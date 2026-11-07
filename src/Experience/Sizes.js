export default class Sizes {
    constructor() {
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio || 1, this.isMobile ? 1 : 1.25)
        this.callbacks = new Set()
        this.resizeFrame = null
        this.handleResize = this.handleResize.bind(this)

        window.addEventListener('resize', this.handleResize, { passive: true })
    }

    get isMobile() {
        return window.matchMedia('(pointer: coarse)').matches
    }

    on(callback) {
        this.callbacks.add(callback)
        return () => this.callbacks.delete(callback)
    }

    handleResize() {
        if (this.resizeFrame) return
        this.resizeFrame = requestAnimationFrame(() => {
            this.resizeFrame = null

            const newWidth = window.innerWidth
            const newHeight = window.innerHeight

            if (this.isMobile && this.width === newWidth) {
                const heightDiff = Math.abs(this.height - newHeight)
                if (heightDiff > 0 && heightDiff < 150) return
            }

            this.width = newWidth
            this.height = newHeight
            this.pixelRatio = Math.min(window.devicePixelRatio || 1, this.isMobile ? 1 : 1.25)
            this.callbacks.forEach((callback) => callback())
        })
    }

    destroy() {
        window.removeEventListener('resize', this.handleResize)
        if (this.resizeFrame) cancelAnimationFrame(this.resizeFrame)
        this.callbacks.clear()
    }
}
