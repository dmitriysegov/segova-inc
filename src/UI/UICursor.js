import { gsap } from '../plugins/gsap.js'

export default class UICursor {
    constructor() {
        if (!window.matchMedia('(pointer: fine)').matches) return

        this.create()
        this.setEvents()
    }

    create() {
        this.element = document.createElement('div')
        this.element.className = 'custom-cursor'
        document.body.appendChild(this.element)

        this.cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
        this.mouse = { ...this.cursor }
        this.setX = gsap.quickSetter(this.element, 'x', 'px')
        this.setY = gsap.quickSetter(this.element, 'y', 'px')
        this.isTicking = false
        gsap.set(this.element, { xPercent: -50, yPercent: -50 })
        this.setX(this.cursor.x)
        this.setY(this.cursor.y)

        this.tick = () => {
            const deltaX = this.mouse.x - this.cursor.x
            const deltaY = this.mouse.y - this.cursor.y

            this.cursor.x += deltaX * 0.4
            this.cursor.y += deltaY * 0.4
            this.setX(this.cursor.x)
            this.setY(this.cursor.y)

            if (Math.abs(deltaX) < 0.1 && Math.abs(deltaY) < 0.1) {
                this.cursor.x = this.mouse.x
                this.cursor.y = this.mouse.y
                this.isTicking = false
                gsap.ticker.remove(this.tick)
            }
        }
        gsap.ticker.add(this.tick)
    }

    setEvents() {
        this.handlePointerMove = (event) => {
            this.mouse.x = event.clientX
            this.mouse.y = event.clientY
            this.element.classList.add('is-visible')
            if (!this.isTicking) {
                this.isTicking = true
                gsap.ticker.add(this.tick)
            }
        }
        this.handlePointerOver = (event) => {
            if (event.target.closest('a, button, .magnetic-btn')) {
                this.element.classList.add('hover')
            }
        }
        this.handlePointerOut = (event) => {
            const target = event.target.closest('a, button, .magnetic-btn')
            const nextTarget = event.relatedTarget?.closest?.('a, button, .magnetic-btn')
            if (target && target !== nextTarget) {
                this.element.classList.remove('hover')
            }
        }
        window.addEventListener('pointermove', this.handlePointerMove, { passive: true })
        document.addEventListener('pointerover', this.handlePointerOver)
        document.addEventListener('pointerout', this.handlePointerOut)
    }

    destroy() {
        gsap.ticker.remove(this.tick)
        window.removeEventListener('pointermove', this.handlePointerMove)
        document.removeEventListener('pointerover', this.handlePointerOver)
        document.removeEventListener('pointerout', this.handlePointerOut)
        this.element?.remove()
    }
}
