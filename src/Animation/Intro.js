import { gsap } from '../plugins/gsap.js'

export default class Intro
{
    constructor(experience)
    {
        this.experience = experience

        this.camera = experience.camera.instance

        this.hero = document.querySelector('.hero-content')
        this.timeline = null

            if(!this.hero)
            {
                return
            }

            this.play()
        }

    play()
    {
        this.timeline = gsap.timeline()

        this.timeline
        .from(
            this.camera.position,
            {
                z:12,
                duration:2,
                ease:'power3.out'
            }
        )
        .to(
            this.hero,
            {
                y:0,
                opacity:1,
                duration:1,
                ease:'power3.out'
            },
            '-=0.5'
        )
    }

    destroy()
    {
        this.timeline?.kill()
    }
}
