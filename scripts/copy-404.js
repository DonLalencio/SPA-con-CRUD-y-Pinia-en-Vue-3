import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

// GitHub Pages no aplica el fallback de una SPA. Copiar index.html como 404.html
// permite que Vue Router resuelva rutas profundas como /productos o /carrito.
const origen = resolve('dist/index.html')
const destino = resolve('dist/404.html')

copyFileSync(origen, destino)
console.log('✓ dist/404.html generado para las rutas de Vue Router')
