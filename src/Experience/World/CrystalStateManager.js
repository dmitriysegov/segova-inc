import { gsap } from '../../plugins/gsap.js'

// Единый центр настройки визуала кристалла для всего сайта
const STATES = {
    hero:       { glow: 0.8, core: 1.0, rotation: 0.002, particles: 1.5, shape: 'open' },
    teacher:    { glow: 0.9, core: 1.0, rotation: 0.0025, particles: 1.5, shape: 'closed' },
    directions: { glow: 0.6, core: 0.8, rotation: 0.001, particles: 1.0, shape: 'open' },
    methodology:{ glow: 1.2, core: 1.0, rotation: 0.003, particles: 1.8, shape: 'closed' },
    advantages: { glow: 0.2, core: 0.4, rotation: 0.001, particles: 0.5, shape: 'closed' }, // ⚡ Специально для этой секции
    timeline:   { glow: 1.0, core: 1.2, rotation: 0.003, particles: 3.0, shape: 'open' },
    contacts:   { glow: 0.4, core: 0.7, rotation: 0.0008, particles: 0.8, shape: 'closed' },
    reviews:    { glow: 0.8, core: 1.0, rotation: 0.001, particles: 1.2, shape: 'open' },
    footer:     { glow: 0.2, core: 0.5, rotation: 0.0005, particles: 0.5, shape: 'closed' }
}

export default class CrystalStateManager 
{
    constructor(crystal) 
    {
        this.crystal = crystal
        
        // 1. Базовые значения (текущая секция)
        this.base = { ...STATES.hero }
        
        // 2. Целевые значения (база + модификаторы от скролла)
        this.target = { ...STATES.hero }
        
        // 3. Текущие значения (которые читает Three.js каждый кадр)
        this.current = { ...STATES.hero }
        
        this.currentState = 'hero'
    }

    // Переключение глобального состояния (при входе в секцию)
    setState(name) 
    {
        if (!STATES[name] || this.currentState === name) return
        this.currentState = name
        
        const config = STATES[name]
        
        // Плавно переводим базовые параметры
        gsap.killTweensOf(this.base)
        gsap.to(this.base, {
            glow: config.glow,
            core: config.core,
            rotation: config.rotation,
            particles: config.particles,
            duration: 1.5,
            ease: 'power2.inOut'
        })

        // Управляем аниматором геометрии
    }

    // Накидываем кинетическую энергию (вызывается из ScrollTrigger.onUpdate)
    addPulse({ glow = 0, core = 0, particles = 0 }) 
    {
        // Перебиваем таргет. Когда скролл остановится, метод update() 
        // сам плавно вернет таргет обратно к this.base
        this.target.glow = this.base.glow + glow
        this.target.core = this.base.core + core
        this.target.particles = this.base.particles + particles
    }

    // Вызывается каждый кадр из Crystal.update()
    update() 
    {
        // 1. Таргет стремится "остыть" и вернуться к базе (если нет импульсов)
        this.target.glow += (this.base.glow - this.target.glow) * 0.05
        this.target.core += (this.base.core - this.target.core) * 0.05
        this.target.particles += (this.base.particles - this.target.particles) * 0.05
        this.target.rotation = this.base.rotation // Вращение берем напрямую

        // 2. Текущие значения плавно (Lerp) догоняют таргет
        this.current.glow += (this.target.glow - this.current.glow) * 0.08
        this.current.core += (this.target.core - this.current.core) * 0.08
        this.current.rotation += (this.target.rotation - this.current.rotation) * 0.08
        this.current.particles += (this.target.particles - this.current.particles) * 0.08
    }
}
