import * as THREE from 'three'
import WebGL from 'three/addons/capabilities/WebGL.js'
import Intro from '../Animation/Intro.js'
import Sizes from './Sizes.js'
import Time from './Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World.js'
import Cursor from './Cursor.js'

let instance = null

export default class Experience
{
    constructor()
    {
        if(instance)
        {
            return instance
        }

        instance = this

        this.canvas = document.querySelector('canvas.webgl')
        this.isSupported = Boolean(this.canvas && WebGL.isWebGL2Available())

        if (!this.isSupported) {
            document.documentElement.classList.add('no-webgl')
            return
        }

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color('#050608')

        this.sizes = new Sizes()
        this.cursor = new Cursor()
        this.time = new Time()
        this.camera = new Camera()
        this.world = new World()
        this.renderer = new Renderer()
        this.intro = new Intro(this)

        this.unsubscribeTick = this.time.on((delta, elapsed) =>
        {
            this.camera.update(delta)
            this.world.update(delta, elapsed)
            this.renderer.update()
        })

    }

    destroy()
    {
        this.unsubscribeTick?.()
        this.intro?.destroy?.()
        this.world?.destroy?.()
        this.renderer?.destroy?.()
        this.camera?.destroy?.()
        this.sizes?.destroy?.()
        this.cursor?.destroy?.()
        this.time?.destroy?.()
        instance = null
    }
}
