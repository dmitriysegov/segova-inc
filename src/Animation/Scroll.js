import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../plugins/gsap.js'
import Experience from '../Experience/Experience.js'
import { clearLenis, setLenis } from '../classes/ScrollService.js'

export default class Scroll {
    constructor() {
        this.experience = new Experience()
        this.lenis = new Lenis({
            duration: 1.1,
            smoothWheel: true,
            syncTouch: false
        })
        setLenis(this.lenis)

        this.onLenisScroll = () => ScrollTrigger.update()
        this.onTick = (time) => this.lenis.raf(time * 1000)
        this.lenis.on('scroll', this.onLenisScroll)
        gsap.ticker.add(this.onTick)
        gsap.ticker.lagSmoothing(0)

        this.cameraTween = gsap.to(this.experience.camera.instance.position, {
            scrollTrigger: {
                trigger: document.documentElement,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            },
            y: -1.5,
            ease: 'none'
        })
    }

    destroy() {
        this.cameraTween?.scrollTrigger?.kill()
        this.cameraTween?.kill()
        gsap.ticker.remove(this.onTick)
        this.lenis.off('scroll', this.onLenisScroll)
        this.lenis.destroy()
        clearLenis(this.lenis)
    }
}
