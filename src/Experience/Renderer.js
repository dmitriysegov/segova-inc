import * as THREE from 'three'
import Experience from './Experience.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

export default class Renderer {
    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.unsubscribeResize = this.sizes.on(() => this.resize())

        this.setRenderer()
        this.setComposer()
    }

    setRenderer() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: false,
            alpha: false,
            powerPreference: 'high-performance'
        })
        this.instance.outputColorSpace = THREE.SRGBColorSpace
        this.instance.toneMapping = THREE.ACESFilmicToneMapping
        this.instance.toneMappingExposure = 1.1
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.setSize(this.sizes.width, this.sizes.height)
    }

    setComposer() {
        this.usePostprocessing = !this.sizes.isMobile
        if (!this.usePostprocessing) return

        this.composer = new EffectComposer(this.instance)
        this.renderPass = new RenderPass(this.scene, this.camera)
        this.composer.addPass(this.renderPass)
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.sizes.width, this.sizes.height),
            this.sizes.isMobile ? 0.05 : 0.08, // ⚡ strength (сила света)
            0.2,  // radius
            0.75  // ⚡ threshold (запрещает светиться средним цветам, убирая белое пятно)
        )
        this.composer.addPass(this.bloomPass)
    }

    resize() {
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.composer?.setPixelRatio(this.sizes.pixelRatio)
        this.composer?.setSize(this.sizes.width, this.sizes.height)
    }

    update() {
        if (this.usePostprocessing) {
            this.composer.render()
        } else {
            this.instance.render(this.scene, this.camera)
        }
    }

    destroy() {
        this.unsubscribeResize?.()
        this.bloomPass?.dispose()
        this.composer?.dispose()
        this.instance?.dispose()
        this.instance?.forceContextLoss()
    }
}
