import BaseSection from '../classes/BaseSection.js'
import { scrollToTarget, scrollToTop } from '../classes/ScrollService.js'

export default class Footer extends BaseSection 
{
    constructor() 
    {
        super('footer')
        this.element.setAttribute('role', 'contentinfo')
        this.render()
        this.setEvents()
    }

    render() 
    {
        this.element.innerHTML = `
        <div class="footer-content">
            <div class="footer-top">
                <a href="#home" class="footer-logo footer-link" aria-label="Segova Inc — главная">Segova Inc</a>
                <div class="footer-links">
                    <a href="#home" class="footer-link">Главная</a>
                    <a href="#about" class="footer-link">О преподавателе</a>
                    <a href="#contacts" class="footer-link">Контакты</a>
                </div>
                <button class="footer-top-btn magnetic-btn" type="button">
                    <span>↑</span> Наверх
                </button>
            </div>

            <div class="footer-divider"></div>

            <div class="footer-bottom">
                <p>© 2026 Segova Inc. Сегова Александра Юрьевна. Все права защищены.</p>
                <p class="footer-author">Индивидуальное обучение нового поколения</p>
            </div>
        </div>
        `
    }

    setEvents() 
    {
        const topBtn = this.element.querySelector('.footer-top-btn')
        const links = this.element.querySelectorAll('.footer-link')

        // ⚡ Элегантный fallback
        this.addListener(topBtn, 'click', () => {
            scrollToTop()
        })

        links.forEach(link => {
            this.addListener(link, 'click', (e) => {
                e.preventDefault()
                const targetId = link.getAttribute('href')
                scrollToTarget(targetId)
            })
        })
    }
}
