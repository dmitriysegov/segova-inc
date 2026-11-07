import CrystalStateManager from './CrystalStateManager.js'
import { gsap, ScrollTrigger } from '../../plugins/gsap.js'
import CrystalGenerator from './CrystalGenerator.js'
import * as THREE from 'three'
import Experience from '../Experience.js'

const DEFAULT_STATE = { rotation: 0.002, particles: 1, glow: 2.5, core: 1.2 }

export default class Crystal
{
    constructor()
    {
        this.experience = new Experience()

        this.scene = this.experience.scene
        this.cursor = this.experience.cursor
        this.sizes = this.experience.sizes 

        this.createOuter()
        this.createCore()
        this.createParticles()

        this.setAnimation()
        this.animateEntrance()
        this.stateManager = new CrystalStateManager(this)
        this.bindScrollTriggers()
    }

    createOuter()
    {
        const generator = new CrystalGenerator()
        const isMobile = this.sizes.width < 768
        const geometry = generator.generate(4)

        this.outerMaterial = new THREE.MeshPhysicalMaterial({
            color: '#ffffff',
            metalness: 0,
            roughness: 0.05,
            transmission: 1,
            thickness: 3,
            ior: 1.45,
            clearcoat: 1,
            clearcoatRoughness: 0,
            envMapIntensity: 2,
            side: THREE.DoubleSide
        })

        this.outer = new THREE.Mesh(geometry, this.outerMaterial)
        this.scene.add(this.outer)
    }

    createCore()
    {
        const geometry = new THREE.IcosahedronGeometry(0.45, 2)
        this.coreMaterial = new THREE.MeshStandardMaterial({
            color: '#D5B36A', 
            emissive: '#D5B36A',
            emissiveIntensity: 0.3, // ⚡ Радикально снижаем яркость
            metalness: 0.2,
            roughness: 0.1
        })
        this.core = new THREE.Mesh(geometry, this.coreMaterial)
        this.scene.add(this.core)
    }

    createParticles()
    {
        const isMobile = this.sizes.width < 768
        const count = isMobile ? 120 : 200
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(count * 3)

        for(let i = 0; i < count; i++)
        {
            const radius = 2 + Math.random() * 2.5
            const x = (Math.random() - 0.5) * radius
            const y = (Math.random() - 0.5) * radius
            const z = (Math.random() - 0.5) * radius

            const index = i * 3
            positions[index] = x
            positions[index + 1] = y
            positions[index + 2] = z
        }

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
        )

        this.particlesMaterial = new THREE.PointsMaterial({
            color: '#ffffff',
            size: isMobile ? 0.018 : 0.025,
            transparent: true,
            opacity: isMobile ? 0.45 : 0.8,
            blending: isMobile ? THREE.NormalBlending : THREE.AdditiveBlending,
            depthWrite: false
        })

        this.particles = new THREE.Points(geometry, this.particlesMaterial)
        this.scene.add(this.particles)
    }

    setAnimation()
    {
        const isMobile = this.sizes.width < 768
        this.baseOuterScale = isMobile ? 0.55 : 0.9
        this.currentOuterScale = 0
        this.targetOuterScale = 0
        this.currentOffsetX = 0
        this.targetOffsetX = 0

    }

    bindScrollTriggers()
    {
        this.scrollTriggers = []
        this.scrollOffsetY = 0
        const setCrystalState = (name) => {
            if (!this.stateManager) return
            this.stateManager.setState(name)
            
            this.targetOuterScale = name === 'hero'
                ? this.baseOuterScale
                : (name === 'contacts' || name === 'footer' || name === 'advantages') // ⚡ Уменьшаем для Advantages
                    ? this.sizes.isMobile ? 0.2 : 0.26
                    : this.sizes.isMobile ? 0.34 : 0.48
                    
            this.targetOffsetX = !this.sizes.isMobile && name === 'teacher'
                ? -1.5
                : !this.sizes.isMobile && name === 'contacts'
                    ? -2.3
                    : 0
        }
        const createTrigger = (config) => {
            if (document.querySelector(config.trigger)) {
                this.scrollTriggers.push(ScrollTrigger.create(config))
            }
        }
        const outerYTo = gsap.quickTo(this, "scrollOffsetY", { duration: 0.5, ease: 'power2.out' })
        const outerRotateZTo = gsap.quickTo(this.outer.rotation, "z", { duration: 0.5 })

        createTrigger({
            trigger: '.teacher',
            start: 'top center',
            onEnter: () => setCrystalState('teacher'),
            onEnterBack: () => setCrystalState('teacher'),
            onLeaveBack: () => setCrystalState('hero')
        })

        createTrigger({
            trigger: '.directions',
            start: 'top center',
            onEnter: () => setCrystalState('directions'),
            onEnterBack: () => setCrystalState('directions'),
            onLeaveBack: () => setCrystalState('teacher'),
            onUpdate: (self) => {
                outerYTo(Math.sin(self.progress * Math.PI) * 0.3)
                outerRotateZTo((self.progress - 0.5) * 0.2)
            }
        })

        createTrigger({
            trigger: '.methodology',
            start: 'top center',
            onEnter: () => setCrystalState('methodology'),
            onEnterBack: () => setCrystalState('methodology'),
            onLeaveBack: () => setCrystalState('directions')
        })

        // ⚡ ВОТ НЕДОСТАЮЩИЙ ТРИГГЕР
        createTrigger({
            trigger: '.advantages',
            start: 'top center',
            onEnter: () => setCrystalState('advantages'),
            onEnterBack: () => setCrystalState('advantages'),
            onLeaveBack: () => setCrystalState('methodology')
        })

        createTrigger({
            trigger: '.timeline',
            start: 'top center',
            onEnter: () => setCrystalState('timeline'),
            onEnterBack: () => setCrystalState('timeline'),
            onLeaveBack: () => setCrystalState('advantages'), // ⚡ Возврат к advantages
            onUpdate: (self) => {
                const glowPulse = Math.sin(self.progress * Math.PI * 6) * 1.5
                const scrollPhysics = Math.abs(self.getVelocity() / 1500)
                this.stateManager.addPulse({
                    glow: Math.abs(glowPulse),
                    particles: scrollPhysics
                })
            }
        })

        createTrigger({
            trigger: '.reviews',
            start: 'top center',
            onEnter: () => setCrystalState('reviews'),
            onEnterBack: () => setCrystalState('reviews'),
            onLeaveBack: () => setCrystalState('timeline'),
            onUpdate: (self) => {
                const corePulse = Math.sin(self.progress * Math.PI) * 0.2
                this.stateManager.addPulse({ core: corePulse })
            }
        })

        createTrigger({
            trigger: '.contacts',
            start: 'top center',
            onEnter: () => setCrystalState('contacts'),
            onEnterBack: () => setCrystalState('contacts'),
            onLeaveBack: () => setCrystalState('reviews')
        })

        createTrigger({
            trigger: '.footer',
            start: 'top 80%',
            onEnter: () => setCrystalState('footer'),
            onLeaveBack: () => setCrystalState('contacts')
        })
    }
    update(delta, elapsed)
    {
        // 1. ОБНОВЛЯЕМ МЕНЕДЖЕР СОСТОЯНИЙ (он сам делает плавный Lerp внутри)
        if (this.stateManager) {
            this.stateManager.update()
        }

        // Берем вычисленные значения (если менеджер еще не успел создаться, берем заглушку)
        const current = this.stateManager ? this.stateManager.current : DEFAULT_STATE

        // 2. БАЗОВЫЕ АНИМАЦИИ (Вращение)
        // current.rotation заменяет старый this.rotationSpeed
        // current.particles заменяет старый this.particlesSpeedMultiplier
        const frameFactor = delta * 60
        this.outer.rotation.y += current.rotation * frameFactor
        this.core.rotation.y -= 0.004 * current.particles * frameFactor
        this.particles.rotation.y += current.rotation * 0.8 * current.particles * frameFactor

        // Легкое "дыхание" по оси Y (твой оригинальный код)
        // Но если outer.position.y обновляется в ScrollTrigger через quickTo, 
        // это может конфликтовать. Оставим пока как было у тебя:
        this.outer.position.y = Math.sin(elapsed) * 0.05 + this.scrollOffsetY
        this.currentOffsetX += (this.targetOffsetX - this.currentOffsetX) * 0.05
        this.outer.position.x = this.currentOffsetX
        this.core.position.x = this.currentOffsetX
        this.particles.position.x = this.currentOffsetX

        // 3. МАСШТАБ (Scale)
        // Твой LERP для outer (сохраняем, так как он не управляется менеджером)
        this.currentOuterScale += (this.targetOuterScale - this.currentOuterScale) * 0.05
        this.outer.scale.set(this.currentOuterScale, this.currentOuterScale * 1.21, this.currentOuterScale)

        // Масштаб ядра берем из менеджера (current.core заменяет this.currentCoreScale)
        const coreScaleFactor = this.sizes.isMobile ? 0.36 : 1
        this.core.scale.setScalar(current.core * coreScaleFactor)

        // 4. ИНТЕНСИВНОСТЬ МАТЕРИАЛОВ (Свечение)
        // current.glow заменяет старый this.glowPower
        const glowFactor = this.sizes.isMobile ? 0.32 : 1
        const glowPulse = this.sizes.isMobile ? 0.025 : 0.2
        const environmentIntensity = this.sizes.isMobile ? 0.9 : 2
        const mobileGlow = this.sizes.isMobile ? Math.min(current.glow, 1.8) : current.glow
        this.coreMaterial.emissiveIntensity = mobileGlow * glowFactor + Math.sin(elapsed * 2) * glowPulse
        this.outerMaterial.envMapIntensity = environmentIntensity + Math.sin(elapsed * 1.5) * (this.sizes.isMobile ? 0.03 : 0.15)

        // 5. РЕАКЦИЯ НА МЫШЬ (Твой оригинальный код)
        this.outer.rotation.x += (this.cursor.y * 0.5 - this.outer.rotation.x) * 0.05
        this.outer.rotation.z += (this.cursor.x * 0.5 - this.outer.rotation.z) * 0.05
    }

    animateEntrance()
    {
        this.entranceAnimations = []
        this.entranceAnimations.push(gsap.to(this, { 
            targetOuterScale: this.baseOuterScale, 
            duration: 2, 
            ease: 'power3.out' 
        }))
        
        this.entranceAnimations.push(gsap.to(this.particles.scale, { 
            x: 1, y: 1, z: 1, 
            duration: 2, 
            delay: 1, 
            ease: 'power3.out' 
        }))
    }

    destroy()
    {
        this.entranceAnimations?.forEach((animation) => animation.kill())
        this.entranceAnimations = []
        this.scrollTriggers?.forEach((trigger) => trigger.kill())
        this.scrollTriggers = []
        if (this.stateManager) gsap.killTweensOf(this.stateManager.base)
        ;[this.outer, this.core, this.particles].forEach((object) => this.scene.remove(object))
        this.outer.geometry.dispose()
        this.outerMaterial.dispose()
        this.core.geometry.dispose()
        this.coreMaterial.dispose()
        this.particles.geometry.dispose()
        this.particlesMaterial.dispose()
    }
}
