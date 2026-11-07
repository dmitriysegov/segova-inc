import BaseSection from '../classes/BaseSection.js'
import { TIMELINE_DATA } from '../data/timeline.js'
import { gsap } from '../plugins/gsap.js'

export default class Timeline extends BaseSection 
{
    constructor() 
    {
        super('timeline')
        this.render()
    }

    init()
    {
        this.animate()
    }

    render() 
    {
        const itemsHTML = TIMELINE_DATA.map(item => `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-card">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                </div>
            </div>
        `).join('')

        this.element.innerHTML = `
        <div class="timeline-content">
            <h2>Как проходят занятия</h2>

            <div class="timeline-wrapper">
                <div class="timeline-line-bg"></div>
                <div class="timeline-line-progress"></div>
                <div class="timeline-pulse"></div>

                ${itemsHTML}
            </div>
        </div>
        `
    }

    animate() 
    {
        const wrapper = this.element.querySelector('.timeline-wrapper')
        const items = this.element.querySelectorAll('.timeline-item')
        const progressLine = this.element.querySelector('.timeline-line-progress')
        const pulse = this.element.querySelector('.timeline-pulse')

        // Растущая золотая линия
        this.addAnimation(
            gsap.to(progressLine, {
                scrollTrigger: {
                    trigger: wrapper,
                    start: 'top 50%',
                    end: 'bottom 50%',
                    scrub: true
                },
                scaleY: 1,
                transformOrigin: 'top center',
                ease: 'none'
            })
        )

        // Световой импульс с адаптивным пересчетом при ресайзе (invalidateOnRefresh)
        this.addAnimation(
            gsap.to(pulse, {
                scrollTrigger: {
                    trigger: wrapper,
                    start: 'top 50%',
                    end: 'bottom 50%',
                    scrub: true,
                    invalidateOnRefresh: true 
                },
                y: () => wrapper.offsetHeight - 20, 
                ease: 'none'
            })
        )

        // Анимация появления карточек и точек
        items.forEach((item) => {
            const dot = item.querySelector('.timeline-dot')
            const card = item.querySelector('.timeline-card')

            this.addAnimation(
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 75%'
                    },
                    clipPath: 'inset(0 100% 0 0)',
                    opacity: 0,
                    duration: 1.2,
                    ease: 'power4.out'
                })
            )

            this.addAnimation(
                gsap.from(dot, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 50%'
                    },
                    scale: 0,
                    duration: 0.5,
                    ease: 'back.out(2)'
                })
            )
        })
    }
}