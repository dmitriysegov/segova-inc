let lenisInstance = null

export function setLenis(instance) {
    lenisInstance = instance
}

export function clearLenis(instance) {
    if (lenisInstance === instance) lenisInstance = null
}

export function stopScroll() {
    lenisInstance?.stop()
}

export function startScroll() {
    lenisInstance?.start()
}

export function scrollToTarget(target, options = {}) {
    const element = typeof target === 'string' ? document.querySelector(target) : target
    if (!element) return

    if (lenisInstance) {
        lenisInstance.scrollTo(element, { offset: options.offset ?? 0 })
        return
    }

    // Lenis always owns smooth scrolling when it is active; this fallback runs only without it.
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth'
    element.scrollIntoView({ behavior, block: 'start' })
}

export function scrollToTop() {
    if (lenisInstance) {
        lenisInstance.scrollTo(0)
        return
    }

    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth'
    window.scrollTo({ top: 0, behavior })
}
