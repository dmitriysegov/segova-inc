export const THEME = {
    colors: {
        gold: '#D5B36A',
        bg: '#030406',
        text: '#F4F4F4',
        textMuted: 'rgba(255, 255, 255, 0.6)'
    },
    anim: {
        duration: {
            fast: 0.2,
            base: 0.5,
            slow: 0.8,
            epic: 1.2
        },
        ease: {
            default: 'power2.out',
            smooth: 'power3.out',
            bounce: 'back.out(1.4)',
            spring: 'elastic.out(1, 0.3)',
            linear: 'none'
        }
    },
    physics: {
        tiltMaxRotation: 10,  // Максимальный угол наклона карточек
        tiltScale: 1.02       // Увеличение карточки при наведении
    }
}