import BaseSection from '../classes/BaseSection.js'
import { gsap } from '../plugins/gsap.js'

export default class Advantages extends BaseSection
{
    constructor()
    {
        super('advantages')
        this.render()
    }

    init()
    {
        this.animate()
    }

    render()
    {
        this.element.innerHTML = `
        <div class="advantages-content">
            <h2>Почему выбирают Segova Inc</h2>
            <p class="advantages-lead">Фундаментальные знания, уверенность в себе и спокойствие родителей. Обучение, построенное на колоссальном профессиональном опыте и искренней любви к детям.</p>

            <div class="advantages-grid">
                
                <div class="adv-card">
                    <div class="adv-accent"></div>
                    <div class="adv-icon">✦</div>
                    <h3>30+ лет педагогического стажа</h3>
                    <p>За три десятилетия работы Александра Юрьевна помогла сотням учеников. Этот огромный опыт позволяет с первых минут безошибочно определять причину трудностей, видеть скрытый потенциал и подбирать правильный «ключик» к характеру любого ребёнка.</p>
                </div>

                <div class="adv-card">
                    <div class="adv-accent"></div>
                    <div class="adv-icon">✦</div>
                    <h3>Бережная среда без стресса</h3>
                    <p>Мы полностью исключаем давление, крик и страх плохой оценки. Занятия проходят в атмосфере абсолютной поддержки. Ученик перестает бояться ошибаться, раскрывается эмоционально и начинает искренне верить в собственные силы.</p>
                </div>

                <div class="adv-card">
                    <div class="adv-accent"></div>
                    <div class="adv-icon">✦</div>
                    <h3>Понимание вместо зубрёжки</h3>
                    <p>Никакого механического заучивания сухих правил. Самые сложные темы школьной программы объясняются простым, доступным языком через жизненные примеры. Ребёнок начинает видеть логику предмета, что дает результат на долгие годы.</p>
                </div>

                <div class="adv-card">
                    <div class="adv-accent"></div>
                    <div class="adv-icon">✦</div>
                    <h3>Полное спокойствие родителей</h3>
                    <p>Вам больше не нужно тратить вечера на нервный разбор домашних заданий. Вы регулярно получаете детальную обратную связь от педагога, видите реальное улучшение школьных оценок и радуетесь растущей самостоятельности вашего ребёнка.</p>
                </div>

            </div>
        </div>
        `
    }

    animate()
    {
        const cards = this.element.querySelectorAll('.adv-card')

        // ⚡ Используем fromTo вместо from, чтобы анимация никогда не залипала в прозрачности
        this.addAnimation(
            gsap.fromTo(cards, 
                {
                    y: 60,
                    opacity: 0
                },
                {
                    scrollTrigger: {
                        trigger: this.element,
                        start: 'top 75%'
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: 'power3.out'
                }
            )
        )
    }
}