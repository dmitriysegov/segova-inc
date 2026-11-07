import * as THREE from 'three'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'

import Experience from './Experience.js'
import Crystal from './World/Crystal.js'


export default class World
{
    constructor()
    {
        this.isDestroyed = false
        this.experience = new Experience()

        this.scene = this.experience.scene

        this.setEnvironment()
        this.setLights()

        this.crystal = new Crystal()
        
    }

    get crystalObject()
    {
        return this.crystal
    }

    update(delta, elapsed)
    {
        this.crystal.update(delta, elapsed)
    }


    setEnvironment()
    {
        const hdrLoader = new HDRLoader()

        hdrLoader.load(
            'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr',
            (environmentMap) =>
            {
                if (this.isDestroyed) {
                    environmentMap.dispose()
                    return
                }

                environmentMap.mapping =
                    THREE.EquirectangularReflectionMapping

                this.environmentMap = environmentMap
                this.scene.environment =
                    environmentMap
            },
            undefined,
            () => {}
        )
    }


    setLights()
    {
        const ambient = new THREE.AmbientLight(
            0xffffff,
            1.0
        )

        this.scene.add(ambient)


        const light = new THREE.DirectionalLight(
            0xffffff,
            3
        )

        light.position.set(
            3,
            4,
            5
        )

        this.scene.add(light)


        const goldLight = new THREE.PointLight(
            0xD5B36A,
            5,
            10
        )

        goldLight.position.set(
            -2,
            1,
            3
        )

        this.scene.add(goldLight)
        this.lights = [ambient, light, goldLight]
    }

    destroy()
    {
        this.isDestroyed = true
        this.crystal?.destroy?.()
        this.lights?.forEach((light) => this.scene.remove(light))
        this.scene.environment = null
        this.environmentMap?.dispose()
    }
}
