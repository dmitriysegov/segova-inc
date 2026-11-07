import * as THREE from 'three'
import Experience from './Experience.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()

        this.sizes = this.experience.sizes
        this.scene = this.experience.scene

        this.setInstance()

        this.unsubscribeResize = this.sizes.on(() => this.resize())
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        )

        this.instance.position.set(0, 0, 8)

        this.scene.add(this.instance)
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update(delta)
    {
        const cursor = this.experience.cursor
        const damping = 1 - Math.exp(-1.8 * delta)

        this.instance.position.x +=
            (cursor.x * 0.8 - this.instance.position.x) * damping

        this.instance.position.y +=
            (-cursor.y * 0.5 - this.instance.position.y) * damping

        this.instance.lookAt(0, 0, 0)
    }

    moveTo(value)
    {
        this.instance.position.z = value
    }

    destroy()
    {
        this.unsubscribeResize?.()
        this.scene.remove(this.instance)
    }
}
