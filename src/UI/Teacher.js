import BaseSection from '../classes/BaseSection.js'
import { gsap } from '../plugins/gsap.js'
import { THEME } from '../theme.js'

export default class Teacher extends BaseSection
{
    constructor()
    {
        super('teacher', 'about')
        this.render()
    }

    // Запускается SectionManager при скролле
    init()
    {
        this.animate()
    }

    render()
    {
        this.element.innerHTML = `
        <div class="teacher-content">
            <div class="teacher-grid">
                
                <div class="teacher-image-container">
                    <div class="teacher-glow"></div>
                    
                    <div class="teacher-particles">
                        <div class="t-particle p1"></div>
                        <div class="t-particle p2"></div>
                        <div class="t-particle p3"></div>
                    </div>

                    <div class="teacher-glass-frame">
                        <div class="teacher-image">
                            <img src="/images/teacher-portrait.webp" alt="Александра Юрьевна, преподаватель Segova Inc" loading="lazy" decoding="async">
                        </div>
                        <div class="teacher-badge">
                            Опыт и забота
                        </div>
                    </div>
                </div>

                <div class="teacher-info">
                    <h2>
                        Сегова Александра Юрьевна
                    </h2>
                    
                    <h3 class="teacher-subtitle">
                        Преподаватель начальных классов, русского языка и литературы
                    </h3>

                    <p>
                        Моя главная цель — показать ребенку, что учиться интересно. Мы не зазубриваем правила, а понимаем их. Со мной дети начинают любить читать, становятся увереннее в себе и учатся самостоятельности.
                    </p>

                    <ul class="teacher-list">
                        <li><span>✓</span> Понятное объяснение самых сложных тем</li>
                        <li><span>✓</span> Спокойная атмосфера без стресса</li>
                        <li><span>✓</span> Индивидуальный темп работы для каждого</li>
                    </ul>
                </div>

            </div>
        </div>
        `
    }

    animate()
    {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: this.element,
                start: 'top 70%'
            }
        })

        timeline
            .from(this.element.querySelector('.teacher-image-container'), {
                rotateY: 45,
                opacity: 0,
                x: -80,
                duration: 1.4,
                ease: THEME.anim.ease.smooth
            })
            .from(this.element.querySelector('.teacher-info'), {
                opacity: 0,
                x: 80,
                duration: 1.4,
                ease: THEME.anim.ease.smooth
            }, 0.2)

        this.addAnimation(timeline)
    }
}
