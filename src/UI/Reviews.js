import BaseSection from '../classes/BaseSection.js'
import { REVIEWS_DATA } from '../data/reviews.js'
import { gsap } from '../plugins/gsap.js'

export default class Reviews extends BaseSection 
{
    constructor() 
    {
        super('reviews')
        this.render()
    }

    // Запускается SectionManager при скролле к секции
    init()
    {
        this.animate()
    }

    render() 
    {
        const reviewsHTML = REVIEWS_DATA.map(review => `
            <div class="review-card">
                <div class="review-glow"></div>
                <div class="review-header">
                    <div class="review-avatar">${review.avatar}</div>
                    <div class="review-meta">
                        <h3>${review.name}</h3>
                        <span>${review.role}</span>
                    </div>
                </div>
                <p class="review-text">${review.text}</p>
                <div class="review-stars">★★★★★</div>
            </div>
        `).join('')

        this.element.innerHTML = `
        <div class="reviews-content">
            <h2>Отзывы учеников и родителей</h2>
            <div class="reviews-grid">
                ${reviewsHTML}
            </div>
        </div>
        `
    }

    animate() 
    {
        const cards = this.element.querySelectorAll('.review-card')

        this.addAnimation(
            gsap.from(cards, {
                scrollTrigger: {
                    trigger: this.element,
                    start: 'top 70%'
                },
                y: 50,
                rotateX: 10,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: 'power3.out'
            })
        )
    }
}