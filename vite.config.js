import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
     {
      name: 'vite-plugin-range-requets',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.endsWith('.db')) {
            res.setHeader('Accept-Ranges', 'bytes')
          }
          next()
        })
      }
    
    }
  ],
  base: "/CollecTF/",
  build: {
    rollupOptions: {
      external: ['fsevents']
    }
  }

})
