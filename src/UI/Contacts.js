import BaseSection from '../classes/BaseSection.js'
import { gsap } from '../plugins/gsap.js'

export default class Contacts extends BaseSection
{
    constructor()
    {
        super('contacts', 'contacts')
        this.render()
    }

    init()
    {
        this.animate()
        this.setMagneticButtons()
    }

    render()
    {
        this.element.innerHTML = `
        <div class="contacts-content">
            <h2>
                Запишитесь на первое занятие
            </h2>
            <p>
                Запишитесь на бесплатную диагностику. Мы познакомимся, определим уровень знаний ребенка и составим комфортный план работы.
            </p>
            
            <div class="contacts-buttons">
                <a href="https://wa.me/998909997027" target="_blank" rel="noopener noreferrer" class="contact-btn wa magnetic-btn">
                    Написать в WhatsApp
                </a>
                <a href="https://t.me/Segova72" target="_blank" rel="noopener noreferrer" class="contact-btn tg magnetic-btn">
                    Написать в Telegram
                </a>
                <a href="tel:+998909997027" class="contact-btn phone magnetic-btn">
                    Позвонить: +998 90 999 70 27
                </a>
            </div>
            
            <div class="contacts-footer">
                © Segova Inc. Сегова Александра Юрьевна.
            </div>
        </div>
        `
    }

    animate()
    {
        this.addAnimation(
            gsap.from(
                this.element.querySelector('.contacts-content'),
                {
                    scrollTrigger: {
                        trigger: this.element,
                        start: 'top 85%'
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out'
                }
            )
        )
    }

    setMagneticButtons() {
        if (!window.matchMedia('(pointer: fine)').matches) return

        const buttons = this.element.querySelectorAll('.magnetic-btn')

        buttons.forEach(btn => {
            const moveX = gsap.quickTo(btn, 'x', {
                duration: 0.5,
                ease: 'power3.out'
            })
            const moveY = gsap.quickTo(btn, 'y', {
                duration: 0.5,
                ease: 'power3.out'
            })

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
