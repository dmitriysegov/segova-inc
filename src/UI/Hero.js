import BaseSection from '../classes/BaseSection.js'
import { gsap } from '../plugins/gsap.js'
import { getExperience } from '../classes/ExperienceService.js'
import { scrollToTarget } from '../classes/ScrollService.js'
import { THEME } from '../theme.js'

export default class Hero extends BaseSection
{
    constructor()
    {
        super('hero', 'home')
        this.render()
    }

    // Запускается SectionManager, когда секция подходит к экрану
    init()
    {
        this.setMagneticButtons()
        this.setScrollActions()
        this.animateIn()
    }

    setScrollActions()
    {
        const detailsButton = this.element.querySelector('.hero-button-outline')
        const contactLink = this.element.querySelector('a.hero-button')
        this.addListener(detailsButton, 'click', () => scrollToTarget('#about'))
        this.addListener(contactLink, 'click', (event) => {
            event.preventDefault()
            scrollToTarget('#contacts')
        })
    }

    render()
    {
        const titleText = 'Segova Inc'
        const chars = titleText.split('').map(char => `<span class="char" aria-hidden="true">${char}</span>`).join('')

        this.element.innerHTML = `
            <div class="hero-content">
                <p class="hero-label">Индивидуальное обучение</p>

                <h1 class="hero-title" aria-label="Segova Inc">
                    ${chars}
                </h1>

                <p class="hero-description">
                    Сегова Александра Юрьевна. Ваш личный преподаватель начальных классов, русского языка и литературы. Подготовка к школе без стресса и слез.
                </p>

                <div class="hero-buttons">
                    <a href="#contacts" style="text-decoration: none;" class="hero-button magnetic-btn">Записаться</a>
                    <button class="hero-button hero-button-outline magnetic-btn" type="button">Подробнее</button>
                </div>

                <div class="hero-features">
                    <div class="hero-feature">✓ Индивидуальный подход</div>
                    <div class="hero-feature">✓ Онлайн и офлайн</div>
                    <div class="hero-feature">✓ Первое занятие бесплатно</div>
                </div>

                <div class="hero-scroll">
                    <span></span>
                    <p>Scroll</p>
                </div>
            </div>
        `
    }

    animateIn()
    {
        const tl = gsap.timeline({ delay: 0.5 })
        const chars = this.element.querySelectorAll('.char')
        const secondaryContent = [
            this.element.querySelector('.hero-description'),
            this.element.querySelector('.hero-buttons'),
            this.element.querySelector('.hero-features'),
            this.element.querySelector('.hero-scroll')
        ]

        tl.set(this.element.querySelector('.hero-label'), { opacity: 0, y: 10 })
        tl.set(chars, {
            opacity: 0,
            y: 20,
            scale: 0.9,
            filter: 'blur(10px)',
            willChange: 'transform, opacity, filter'
        })
        tl.set(secondaryContent, { opacity: 0, y: 20, willChange: 'transform, opacity' })

        tl.call(() => {
            const experience = getExperience()
            if (experience?.world?.crystalObject) {
                const crystal = experience.world.crystalObject
                gsap.to(crystal, {
                    targetOuterScale: crystal.baseOuterScale * 1.15,
                    duration: 3,
                    ease: THEME.anim.ease.smooth
                })
            }
        }, null, 0)

        tl.to(this.element.querySelector('.hero-label'), {
            opacity: 0.9,
            y: -10,
            duration: 0.8,
            ease: THEME.anim.ease.smooth
        }, 0)

        tl.to(chars, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            stagger: 0.08,
            ease: 'power4.out',
        }, '-=0.2')

        tl.set(chars, { clearProps: 'filter,willChange' })

        tl.to(secondaryContent, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: THEME.anim.ease.smooth
        }, '-=0.8')

        tl.set(secondaryContent, { clearProps: 'willChange' })

        this.addAnimation(tl)
    }

    setMagneticButtons()
    {
        if (!window.matchMedia('(pointer: fine)').matches) return

        const buttons = this.element.querySelectorAll('.magnetic-btn')

        buttons.forEach(btn => {
            const moveX = gsap.quickTo(btn, 'x', { duration: THEME.anim.duration.base, ease: THEME.anim.ease.smooth })
            const moveY = gsap.quickTo(btn, 'y', { duration: THEME.anim.duration.base, ease: THEME.anim.ease.smooth })

            this.addListener(btn, 'pointermove', (e) => {
                const rect = btn.getBoundingClientRect()
                const x = e.clientX - rect.left - rect.width / 2
                const y = e.clientY - rect.top - rect.height / 2
                
                moveX(x * 0.3)
                moveY(y * 0.3)
            })

            this.addListener(btn, 'pointerleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.3)'
                })
            })
        })
    }
}
