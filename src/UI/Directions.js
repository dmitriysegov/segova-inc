import { DIRECTIONS_DATA } from '../data/directions.js'
import BaseSection from '../classes/BaseSection.js'
import { gsap } from '../plugins/gsap.js'

export default class Directions extends BaseSection 
{
    constructor() 
    {
        super('directions')
        this.render() // Рендерим DOM сразу, чтобы ScrollTrigger правильно посчитал высоту
        
        // ВНИМАНИЕ: мы убрали отсюда this.animate() и this.setTiltEffect()
    }

    // Этот метод вызовет SectionManager, когда мы доскроллим до секции
    init() 
    {
        this.animate()
        this.setTiltEffect()
    }

    render() 
    {
        // Генерируем карточки динамически
        const cardsHTML = DIRECTIONS_DATA.map(item => `
            <div class="direction-card tilt-card">
                <div class="card-sheen"></div>
                <div class="card-glow"></div>
                <div class="card-inner">
                    <div class="card-icon">${item.icon}</div>
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                </div>
            </div>
        `).join('')

        this.element.innerHTML = `
        <div class="directions-content">
            <h2>Направления обучения</h2>
            <div class="directions-grid">
                ${cardsHTML}
            </div>
        </div>
        `
    }

    animate() 
    {
        const cards = this.element.querySelectorAll('.direction-card')

        this.addAnimation(
            gsap.from(cards, {
                scrollTrigger: {
                    trigger: this.element,
                    start: 'top 70%'
                },
                scale: 0.85,
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'back.out(1.4)'
            })
        )
    }

    setTiltEffect() 
    {
        if (!window.matchMedia('(pointer: fine)').matches) return

        const cards = this.element.querySelectorAll('.tilt-card')

        cards.forEach(card => {
            const glow = card.querySelector('.card-glow')
            const inner = card.querySelector('.card-inner')
            const icon = card.querySelector('.card-icon')

            // Создаем быстрые сеттеры один раз
            const rotateXTo = gsap.quickTo(card, "rotateX", { duration: 0.5, ease: "power2.out" })
            const rotateYTo = gsap.quickTo(card, "rotateY", { duration: 0.5, ease: "power2.out" })
            const scaleTo = gsap.quickTo(card, "scale", { duration: 0.5, ease: "power2.out" })
            
            const glowXTo = gsap.quickTo(glow, "x", { duration: 0.2 })
            const glowYTo = gsap.quickTo(glow, "y", { duration: 0.2 })
            const glowOpacityTo = gsap.quickTo(glow, "opacity", { duration: 0.2 })
            
            const innerZTo = gsap.quickTo(inner, "z", { duration: 0.5, ease: "power2.out" })
            const iconZTo = gsap.quickTo(icon, "z", { duration: 0.5, ease: "power2.out" })
            const iconRotateZTo = gsap.quickTo(icon, "rotateZ", { duration: 0.5, ease: "power2.out" })

            // 1. ДВИЖЕНИЕ МЫШИ (Здесь мы ВЫЧИСЛЯЕМ наклон)
            this.addListener(card, 'pointermove', (e) => {
                const rect = card.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                
                const centerX = rect.width / 2
                const centerY = rect.height / 2
                
                const rotateX = ((y - centerY) / centerY) * -10
                const rotateY = ((x - centerX) / centerX) * 10

                // Передаем вычисленные значения
                rotateXTo(rotateX)
                rotateYTo(rotateY)
                scaleTo(1.02)

                glowXTo(x)
                glowYTo(y)
                glowOpacityTo(1)

                innerZTo(30)
                iconZTo(40)
                iconRotateZTo(rotateX * -1.5)
            })

            // 2. УХОД МЫШИ (Здесь мы СБРАСЫВАЕМ в ноль)
            this.addListener(card, 'pointerleave', () => {
                gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.3)' })
                gsap.to(glow, { opacity: 0, duration: 0.5 })
                gsap.to(inner, { z: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' })
                gsap.to(icon, { z: 0, rotateZ: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' })
            })
        })
    }
}
