# Nova Store · SPA con CRUD y Pinia en Vue 3

Aplicación de tienda desarrollada como Single Page Application con **Vue 3**, **Vue Router**, **Pinia** y **Vite**. Incluye un CRUD completo de productos, un carrito de compras con totales en tiempo real y persistencia en `localStorage`.

## 🌐 Demo

- **Sitio publicado:** https://donlalencio.github.io/SPA-con-CRUD-y-Pinia-en-Vue-3/
- **Repositorio:** https://github.com/DonLalencio/SPA-con-CRUD-y-Pinia-en-Vue-3

## ✨ Funcionalidades

- Navegación SPA con Vue Router y rutas profundas.
- Store de productos con listado, búsqueda, filtros y CRUD completo.
- Store del carrito con cantidades, subtotales, total acumulado y vaciado.
- Persistencia automática de productos y carrito en `localStorage`.
- Formularios con validaciones y vista previa en vivo.
- Directivas de Vue: `v-for`, `v-if`, `v-else`, `v-else-if`, `v-model`, `v-show`, `v-bind`, `v-on` y la directiva personalizada `v-foco`.
- Diseño responsive con CSS propio y componentes accesibles.

## 🗺️ Rutas

| Ruta | URL | Descripción |
| --- | --- | --- |
| Inicio | `/` | Página de bienvenida y productos destacados |
| Productos | `/productos` | Catálogo completo con búsqueda y filtros |
| Crear producto | `/productos/crear` | Formulario de registro |
| Editar producto | `/productos/:id` | Formulario de edición |
| Carrito | `/carrito` | Resumen, cantidades y total acumulado |

## 🧠 Stores de Pinia

- `src/stores/products.js`: estado del catálogo, getters (`total`, `categorias`, `destacados`, `buscar`) y acciones (`crear`, `actualizar`, `eliminar`). También persiste los cambios y sincroniza el carrito.
- `src/stores/cart.js`: estado del carrito, totales y acciones (`agregar`, `incrementar`, `disminuir`, `quitar`, `vaciar`). Guarda una instantánea de cada producto y se sincroniza cuando el catálogo cambia.

## 🚀 Ejecución local

```bash
npm install
npm run dev
```

## 📦 Compilación y despliegue

```bash
npm run build
npm run preview
```

El proyecto se publica en GitHub Pages mediante el workflow `.github/workflows/deploy.yml`. Vite usa la base `/SPA-con-CRUD-y-Pinia-en-Vue-3/` en producción y el script `scripts/copy-404.js` genera `404.html` para que Vue Router resuelva rutas profundas en GitHub Pages.

## 📁 Estructura

```
src/
├── assets/          Estilos globales
├── components/      NavBar, ProductCard, ConfirmDialog, ToastHost, AppFooter
├── composables/     Notificaciones toast
├── directives/      Directiva personalizada v-foco
├── router/          Configuración de rutas
├── stores/          Stores de Pinia (productos y carrito)
├── utils/           Formato de moneda
└── views/           Inicio, Productos, Formulario, Carrito y 404
```

## 📄 Evidencias

Los documentos con las capturas de interfaz, capturas de código y explicaciones se entregan junto con el proyecto y se conservan localmente; por su tamaño no se versionan en el repositorio:

- `evidencias/Evidencias-SPA-Vue-Pinia.pdf`
- `evidencias/Evidencias-SPA-Vue-Pinia.docx`
