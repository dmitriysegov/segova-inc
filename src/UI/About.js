import BaseSection from '../classes/BaseSection.js'
import { gsap } from '../plugins/gsap.js'

export default class About extends BaseSection
{
    constructor()
    {
        super('about')
        this.render()
    }

    // Запускается SectionManager при скролле к секции
    init()
    {
        this.animate()
    }

    render()
    {
        this.element.innerHTML = `
        <div class="about-content">
            <h2>
                Индивидуальное обучение
            </h2>
            <p>
                Помогаем детям уверенно освоить школьную программу,
                развивать мышление и уверенность в знаниях.
            </p>
        </div>
        `
    }

    animate()
    {
        const content = this.element.querySelector('.about-content')

        this.addAnimation(
            gsap.to(content, {
                scrollTrigger: {
                    trigger: this.element,
                    start: 'top 70%',
                    end: 'top 30%',
                    scrub: true
                },
                y: 0,
                opacity: 1
            })
        )
    }
}