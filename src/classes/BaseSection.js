// 3 место: Кэшируем контейнер один раз на весь жизненный цикл приложения
const MAIN_CONTAINER = document.querySelector('main') 

export default class BaseSection 
{
    constructor(className, id = null) 
    {
        this.element = document.createElement('section')
        this.element.className = className
        this.element.tabIndex = -1
        if (id) this.element.id = id
        
        this.events = []
        this.animations = []
        
        // 2 место: Изолированное хранилище триггеров
        this.scrollTriggers = [] 
        this.isInitialized = false
        this.mount()
    }

    mount() {
        if (!MAIN_CONTAINER) throw new Error('BaseSection requires a <main> container.')
        MAIN_CONTAINER.appendChild(this.element)
    }

    get hasDeferredInit() {
        return this.init !== BaseSection.prototype.init
    }

    init() {}

    initialize() {
        if (this.isInitialized) return
        this.init()
        this.isInitialized = true
    }

    addListener(el, event, callback, options) {
        el.addEventListener(event, callback, options)
        this.events.push({ el, event, callback, options })
    }

    // ⭐ Твоя гениальная доработка!
    addAnimation(animation) 
    {
        this.animations.push(animation)
        
        // Если внутри анимации был создан ScrollTrigger, автоматически спасаем его в наш массив
        if (animation.scrollTrigger) {
            this.addScrollTrigger(animation.scrollTrigger)
        }
        
        return animation
    }

    addScrollTrigger(trigger) 
    {
        this.scrollTriggers.push(trigger)
        return trigger
    }

    destroy() 
    {
        // Отписываем события
        this.events.forEach(({ el, event, callback, options }) => {
            el.removeEventListener(event, callback, options)
        })
        
        // Убиваем анимации
        this.animations.forEach(anim => anim.kill())
        
        // ⚡ Убиваем ТОЛЬКО триггеры этой конкретной секции, не трогая остальной сайт!
        this.scrollTriggers.forEach(t => t.kill()) 
        
        // Удаляем из DOM
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element)
        }
    }
}
