import BaseSection from '../classes/BaseSection.js' 
import { gsap } from '../plugins/gsap.js'

export default class Methodology extends BaseSection 
{
    constructor() 
    {
        super('methodology') 
        this.render()
    }

    // Запускается SectionManager'ом ТОЛЬКО когда доскроллим
    init()
    {
        this.animate()
    }

    render() 
    {
        this.element.innerHTML = `
        <div class="methodology-content">
            <h2>Как строятся занятия</h2>
            <p class="methodology-lead">Занятие — это не «разобрать домашнее задание на сегодня». Педагог выстраивает для ребёнка спокойную и понятную систему: увидеть причину трудностей, объяснить тему доступно, закрепить навык и вовремя заметить прогресс.</p>

            <div class="steps">
                <div class="step-card">
                    <div class="step-number">01</div>
                    <div class="step-info">
                        <h3>Сначала разбираемся в ситуации</h3>
                        <p>На первой встрече определяем уровень знаний, пробелы и сильные стороны ребёнка. Учитываем его темп, характер, отношение к предмету и запрос родителей — чтобы не тратить время на формальные упражнения.</p>
                    </div>
                </div>

                <div class="step-card">
                    <div class="step-number">02</div>
                    <div class="step-info">
                        <h3>Строим личный маршрут</h3>
                        <p>Составляем последовательный план: от понятных ребёнку шагов к сложным темам, с опорой на школьную программу и его реальные цели. Индивидуальный урок дома даёт возможность работать в комфортном ритме и задавать любые вопросы.</p>
                    </div>
                </div>

                <div class="step-card">
                    <div class="step-number">03</div>
                    <div class="step-info">
                        <h3>Закрепляем результат</h3>
                        <p>Каждую тему объясняем, отрабатываем на практике и возвращаемся к ней до уверенного понимания. Родители получают понятную обратную связь о прогрессе, а программа корректируется, если ребёнку нужен другой темп или дополнительная поддержка.</p>
                    </div>
                </div>
            </div>
        </div>
        `
    }

    animate() 
    {
        const cards = this.element.querySelectorAll('.step-card')

        this.addAnimation(
            gsap.fromTo(cards, 
                { 
                    opacity: 0, 
                    y: 40 
                },
                {
                    scrollTrigger: {
                        trigger: this.element,
                        start: 'top 75%'
                    },
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: 'power3.out'
                }
            )
        )
    }
}
