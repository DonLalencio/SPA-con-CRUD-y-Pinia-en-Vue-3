import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// En GitHub Pages el sitio se publica en /<nombre-del-repositorio>/
// En desarrollo se mantiene en la raíz.
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/SPA-con-CRUD-y-Pinia-en-Vue-3/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}))
