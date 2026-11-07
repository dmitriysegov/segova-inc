import { defineConfig } from 'vite'

export default defineConfig({
    server:
    {
        host: true
    },
    build:
    {
        target: 'esnext',
        // three.js alone is ~550 kB minified; it is already split into its own chunk.
        chunkSizeWarningLimit: 600,
        rolldownOptions:
        {
            output:
            {
                manualChunks(id)
                {
                    if (id.includes('/node_modules/three/')) return 'vendor-three'
                    if (id.includes('/node_modules/gsap/')) return 'vendor-gsap'
                    if (id.includes('/node_modules/lenis/')) return 'vendor-lenis'
                }
            }
        }
    }
})
