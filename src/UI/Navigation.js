import { ScrollTrigger } from '../plugins/gsap.js'
import { scrollToTarget } from '../classes/ScrollService.js'

export default class Navigation
{
    constructor()
    {
        this.create()
        this.setEvents()
    }

    create()
    {
        this.element = document.createElement('nav')
        this.element.className = 'navigation'
        this.element.setAttribute('aria-label', 'Основная навигация')

        this.element.innerHTML = `
            <div class="nav-container">
                <a href="#home" class="logo nav-link" aria-label="Segova Inc — главная">
                    Segova Inc
                </a>

                <div class="links desktop-links">
                    <a href="#home" class="nav-link">Главная</a>
                    <a href="#about" class="nav-link">О преподавателе</a>
                    <a href="#contacts" class="nav-link">Контакты</a>
                </div>

                <button class="burger-btn" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="mobile-navigation">
                    <span></span>
                    <span></span>
                </button>
            </div>

            <div class="mobile-menu" id="mobile-navigation" aria-label="Мобильная навигация" aria-hidden="true" inert>
                <div class="mobile-links">
                    <a href="#home" class="nav-link">Главная</a>
                    <a href="#about" class="nav-link">О преподавателе</a>
                    <a href="#contacts" class="nav-link">Контакты</a>
                </div>
            </div>
        `

        document.body.appendChild(this.element)
    }

    setEvents()
    {
        const burger = this.element.querySelector('.burger-btn')
        const mobileMenu = this.element.querySelector('.mobile-menu')
        const links = this.element.querySelectorAll('.nav-link')
        const container = this.element.querySelector('.nav-container')

        this.scrollTrigger = ScrollTrigger.create({
            start: 'top -50',
            onUpdate: (self) => {
                if (self.progress > 0) {
                    container.classList.add('scrolled')
                } else {
                    container.classList.remove('scrolled')
                }
            }
        })

        this.handleBurgerClick = () => {
            const isOpen = burger.classList.toggle('active')
            mobileMenu.classList.toggle('active', isOpen)
            document.body.classList.toggle('menu-open', isOpen)
            burger.setAttribute('aria-expanded', String(isOpen))
            burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню')
            mobileMenu.setAttribute('aria-hidden', String(!isOpen))
            mobileMenu.inert = !isOpen
            if (isOpen) mobileMenu.querySelector('.nav-link').focus()
        }

        this.handleLinkClick = (e) => {
            e.preventDefault()

            burger.classList.remove('active')
            mobileMenu.classList.remove('active')
            document.body.classList.remove('menu-open')
            burger.setAttribute('aria-expanded', 'false')
            burger.setAttribute('aria-label', 'Открыть меню')
            mobileMenu.setAttribute('aria-hidden', 'true')
            mobileMenu.inert = true

            const targetId = e.currentTarget.getAttribute('href')
            // Используем единый сервис маршрутизации скролла
            scrollToTarget(targetId)
            document.querySelector(targetId)?.focus({ preventScroll: true })
        }

        burger.addEventListener('click', this.handleBurgerClick)
        this.observeSections()

        this.mobileQuery = window.matchMedia('(max-width: 768px)')
        this.handleViewportChange = (event) => {
            if (!event.matches && burger.classList.contains('active')) burger.click()
        }
        this.mobileQuery.addEventListener('change', this.handleViewportChange)

        this.handleKeydown = (event) => {
            if (event.key === 'Escape' && burger.classList.contains('active')) {
                burger.click()
                burger.focus()
            }

            if (event.key === 'Tab' && burger.classList.contains('active')) {
                const focusable = [burger, ...mobileMenu.querySelectorAll('a[href]')]
                const currentIndex = focusable.indexOf(document.activeElement)

                if (currentIndex === -1) {
                    event.preventDefault()
                    focusable[event.shiftKey ? focusable.length - 1 : 0].focus()
                    return
                }

                const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1

                if (nextIndex < 0 || nextIndex === focusable.length) {
                    event.preventDefault()
                    focusable[event.shiftKey ? focusable.length - 1 : 0].focus()
                }
            }
        }
        document.addEventListener('keydown', this.handleKeydown)

        links.forEach(link => {
            link.addEventListener('click', this.handleLinkClick)
        })

        this.burger = burger
        this.links = links
    }

    observeSections() {
        if (!('IntersectionObserver' in window)) return

        this.navigationFrame = requestAnimationFrame(() => {
            const links = [...this.element.querySelectorAll('.links .nav-link, .mobile-links .nav-link')]

            this.sectionObserver = new IntersectionObserver((entries) => {
                const activeEntry = entries.find((entry) => entry.isIntersecting)
                if (!activeEntry) return

                links.forEach((link) => {
                    const isActive = link.getAttribute('href') === `#${activeEntry.target.id}`
                    link.classList.toggle('is-active', isActive)
                    link.toggleAttribute('aria-current', isActive)
                    if (isActive) link.setAttribute('aria-current', 'location')
                })
            }, { rootMargin: '-35% 0px -55%' })

            links.forEach((link) => {
                const section = document.querySelector(link.getAttribute('href'))
                if (section) this.sectionObserver.observe(section)
            })
        })
    }

    destroy() {
        cancelAnimationFrame(this.navigationFrame)
        this.sectionObserver?.disconnect()
        this.scrollTrigger?.kill()
        this.burger?.removeEventListener('click', this.handleBurgerClick)
        this.mobileQuery?.removeEventListener('change', this.handleViewportChange)
        document.removeEventListener('keydown', this.handleKeydown)
        this.links?.forEach(link => {
            link.removeEventListener('click', this.handleLinkClick)
        })
        this.element.remove()
    }
}
