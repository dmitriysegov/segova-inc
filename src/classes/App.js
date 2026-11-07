import Preloader from '../UI/Preloader.js'
import UICursor from '../UI/UICursor.js'
import Navigation from '../UI/Navigation.js'
import Hero from '../UI/Hero.js'
import Teacher from '../UI/Teacher.js'
import Directions from '../UI/Directions.js'
import Methodology from '../UI/Methodology.js'
import Advantages from '../Sections/Advantages.js'
import Timeline from '../UI/Timeline.js'
import Contacts from '../UI/Contacts.js'
import Footer from '../UI/Footer.js'
import { ScrollTrigger } from '../plugins/gsap.js'
import SectionManager from './SectionManager.js'
import { clearExperience, setExperience } from './ExperienceService.js'

export default class App {
    constructor() {
        this.preloader = new Preloader()
        this.sectionManager = new SectionManager()

        this.components = [
            new UICursor(),
            new Navigation()
        ]

        this.sections = [
            new Hero(),
            new Teacher(),
            new Directions(),
            new Methodology(),
            new Advantages(),
            new Timeline(),
            new Contacts(),
            new Footer()
        ]

        this.sections.forEach((section) => this.sectionManager.add(section))

        this.initializeExperience()

        this.handleLoad = () => this.preloader.hide()
        this.handlePageHide = (event) => {
            if (!event.persisted) this.destroy()
        }

        if (document.readyState === 'complete') {
            this.handleLoad()
        } else {
            window.addEventListener('load', this.handleLoad, { once: true })
        }

        window.addEventListener('pagehide', this.handlePageHide)
        ScrollTrigger.refresh()
    }

    async initializeExperience() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const modules = await Promise.all([
            import('../Experience/Experience.js'),
            import('../Animation/Scroll.js')
        ]).catch(() => null)

        if (this.isDestroyed || !modules) return

        const [{ default: Experience }, { default: Scroll }] = modules

        this.experience = new Experience()
        setExperience(this.experience)

        if (!this.experience.isSupported) return

        this.scroll = new Scroll()

        if (!this.preloader.isHidden) this.scroll.lenis.stop()
        ScrollTrigger.refresh()
    }

    destroy() {
        if (this.isDestroyed) return
        this.isDestroyed = true

        window.removeEventListener('load', this.handleLoad)
        window.removeEventListener('pagehide', this.handlePageHide)
        this.scroll?.destroy()
        clearExperience(this.experience)
        this.experience?.destroy()
        this.sectionManager?.destroy()
        this.components.forEach((component) => component.destroy?.())
        this.preloader?.destroy()
    }
}
