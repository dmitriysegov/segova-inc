import * as THREE from 'three'

export default class CrystalGenerator
{
    generate(detail = 4)
    {
        const geometry = new THREE.IcosahedronGeometry(1, detail)

        const position = geometry.attributes.position

        for(let i = 0; i < position.count; i++)
        {
            const noise = 0.85 + Math.random() * 0.45
            const x = position.getX(i) * noise * (0.95 + Math.random() * 0.15)
            const y = position.getY(i) * noise * 1.35
            const z = position.getZ(i) * noise * (0.95 + Math.random() * 0.15)
            position.setXYZ(i, x, y, z)
        }

        position.needsUpdate = true

        geometry.computeVertexNormals()

        return geometry
    }

    generateMobile(detail = 1)
    {
        const geometry = new THREE.OctahedronGeometry(1, detail)
        const position = geometry.attributes.position

        for(let i = 0; i < position.count; i++)
        {
            const x = position.getX(i)
            const y = position.getY(i)
            const z = position.getZ(i)
            const variation = 1 + Math.sin(x * 4.1 + y * 5.7 + z * 6.3) * 0.06
            position.setXYZ(i, x * variation, y * variation * 1.18, z * variation)
        }

        position.needsUpdate = true
        geometry.computeVertexNormals()
        return geometry
    }
}
