import { gsap, ScrollTrigger } from '../plugins/gsap.js'
import { startScroll, stopScroll } from '../classes/ScrollService.js'

export default class Preloader 
{
    constructor() 
    {
        this.timeline = null
        this.isHidden = false
        this.initialOverflow = document.body.style.overflow
        // Ищем прелоадер в HTML или создаем динамически
        this.element = document.querySelector('.preloader')
        if (!this.element) {
            this.create()
        }
        this.element.setAttribute('role', 'status')
        this.element.setAttribute('aria-live', 'polite')
        this.element.setAttribute('aria-label', 'Загрузка сайта')

        // Блокируем скролл сразу при инициализации класса
        document.body.style.overflow = 'hidden'
        stopScroll()
    }

    create() 
    {
        this.element = document.createElement('div')
        this.element.className = 'preloader'
        
        this.element.innerHTML = `
            <div class="preloader-content">
                <div class="preloader-title">Segova Inc</div>
                <div class="preloader-counter">0%</div>
                <div class="preloader-bar-wrap">
                    <div class="preloader-bar"></div>
                </div>
            </div>
        `
        document.body.appendChild(this.element)
    }

    // Этот метод вызывается из main.js по событию 'load'
    hide() 
    {
        if (this.isHidden || !this.element) return
        this.isHidden = true

        const counterObj = { value: 0 }
        const counterEl = this.element.querySelector('.preloader-counter')
        const barEl = this.element.querySelector('.preloader-bar')
        const titleEl = this.element.querySelector('.preloader-title')

        this.timeline = gsap.timeline({
            onComplete: () => this.finish()
        })

        // Показываем элементы счетчика (если они были скрыты)
        this.timeline.fromTo([titleEl, counterEl], 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power3.out' }
        )

        // Анимация бегущих цифр (т.к. ассеты уже загрузились по событию load, делаем анимацию чуть быстрее - 1.5s)
        this.timeline.to(counterObj, {
            value: 100,
            duration: 0.9,
            ease: 'power2.inOut',
            onUpdate: () => {
                if (counterEl) counterEl.innerText = Math.round(counterObj.value) + '%'
            }
        })

        // Полоса загрузки ползет синхронно с цифрами
        this.timeline.to(barEl, {
            scaleX: 1,
            duration: 0.9,
            ease: 'power2.inOut'
        }, '<')

        // Убираем шторку вверх
        this.timeline.to(this.element, {
            yPercent: -100,
            duration: 0.7,
            ease: 'expo.inOut'
        })
    }

    finish() 
    {
        // Возвращаем скролл пользователю
        document.body.style.overflow = this.initialOverflow
        startScroll()

        // Удаляем из DOM
        this.element.remove()

        // ⚡ Сообщаем ScrollTrigger, что пора пересчитать все триггеры, так как ширма ушла
        ScrollTrigger.refresh()
    }

    destroy()
    {
        this.timeline?.kill()
        document.body.style.overflow = this.initialOverflow
        this.element?.remove()
    }
}
