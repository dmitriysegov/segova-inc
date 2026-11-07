export default class SectionManager {
    constructor({ rootMargin = '500px 0px' } = {}) {
        this.sections = new Map()

        if (!('IntersectionObserver' in window)) {
            this.observer = null
            return
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return

                const section = this.sections.get(entry.target)
                section?.initialize()
                this.observer.unobserve(entry.target)
            })
        }, { rootMargin })
    }

    add(section) {
        this.sections.set(section.element, section)

        if (section.hasDeferredInit) {
            if (this.observer) {
                this.observer.observe(section.element)
            } else {
                section.initialize()
            }
        }

        return section
    }

    destroy() {
        this.observer?.disconnect()
        this.sections.forEach((section) => section.destroy?.())
        this.sections.clear()
    }
}
