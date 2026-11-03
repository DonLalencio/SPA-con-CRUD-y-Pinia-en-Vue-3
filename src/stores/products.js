import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useCartStore } from './cart'

const CLAVE_PRODUCTOS = 'nova-store:productos:v1'

export const CATEGORIAS = [
  'Audio',
  'Computación',
  'Accesorios',
  'Gaming',
  'Fotografía',
  'Hogar'
]

export const ICONOS = ['🎧', '⌨️', '🖱️', '🖥️', '🔊', '⌚', '📷', '🎮', '📱', '💡', '🔋', '🎒']

const PRODUCTOS_INICIALES = [
  {
    id: 1,
    nombre: 'Auriculares Nova Pulse',
    precio: 89.9,
    categoria: 'Audio',
    descripcion: 'Sonido envolvente con cancelación activa de ruido y 30 horas de batería.',
    stock: 14,
    icono: '🎧',
    destacado: true
  },
  {
    id: 2,
    nombre: 'Teclado Mecánico KX-75',
    precio: 129.5,
    categoria: 'Computación',
    descripcion: 'Formato compacto 75 %, switches táctiles y retroiluminación RGB personalizable.',
    stock: 9,
    icono: '⌨️',
    destacado: true
  },
  {
    id: 3,
    nombre: 'Mouse Inalámbrico Glide',
    precio: 39.9,
    categoria: 'Accesorios',
    descripcion: 'Sensor de precisión de 4.000 DPI, diseño ergonómico y conexión dual.',
    stock: 25,
    icono: '🖱️',
    destacado: false
  },
  {
    id: 4,
    nombre: 'Monitor UltraWide 29"',
    precio: 349,
    categoria: 'Computación',
    descripcion: 'Panel IPS panorámico ideal para multitarea, con 99 % de cobertura sRGB.',
    stock: 6,
    icono: '🖥️',
    destacado: true
  },
  {
    id: 5,
    nombre: 'Parlante Bluetooth Boom',
    precio: 59.9,
    categoria: 'Audio',
    descripcion: 'Resistencia al agua IPX7, graves profundos y hasta 18 horas de reproducción.',
    stock: 18,
    icono: '🔊',
    destacado: false
  },
  {
    id: 6,
    nombre: 'Smartwatch Fit Pro',
    precio: 119,
    categoria: 'Accesorios',
    descripcion: 'Monitoreo de salud, GPS integrado y pantalla AMOLED de alta visibilidad.',
    stock: 12,
    icono: '⌚',
    destacado: false
  },
  {
    id: 7,
    nombre: 'Cámara Retrato X100',
    precio: 429,
    categoria: 'Fotografía',
    descripcion: 'Sensor APS-C, lente fija luminosa y grabación 4K para creadores de contenido.',
    stock: 4,
    icono: '📷',
    destacado: false
  },
  {
    id: 8,
    nombre: 'Control Inalámbrico Zero',
    precio: 69.9,
    categoria: 'Gaming',
    descripcion: 'Latencia ultrabaja, gatillos ajustables y compatibilidad con PC y consolas.',
    stock: 20,
    icono: '🎮',
    destacado: false
  }
]

function cargarProductos() {
  try {
    const guardado = localStorage.getItem(CLAVE_PRODUCTOS)
    if (!guardado) return structuredClone(PRODUCTOS_INICIALES)
    const datos = JSON.parse(guardado)
    return Array.isArray(datos) ? datos : structuredClone(PRODUCTOS_INICIALES)
  } catch {
    return structuredClone(PRODUCTOS_INICIALES)
  }
}

function sinAcentos(texto = '') {
  return texto
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function normalizar(datos) {
  return {
    nombre: datos.nombre.trim(),
    precio: Math.round((Number(datos.precio) || 0) * 100) / 100,
    categoria: datos.categoria,
    descripcion: (datos.descripcion || '').trim(),
    stock: Math.max(0, Math.trunc(Number(datos.stock) || 0)),
    icono: datos.icono || '📦',
    destacado: Boolean(datos.destacado)
  }
}

/**
 * Store de productos.
 * Contiene el listado, los getters de consulta y las acciones del CRUD.
 * La persistencia en localStorage y la sincronización con el carrito
 * también viven aquí, nunca dentro de los componentes.
 */
export const useProductsStore = defineStore('productos', () => {
  const productos = ref(cargarProductos())

  watch(
    productos,
    (valor) => {
      localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(valor))
    },
    { deep: true }
  )

  const total = computed(() => productos.value.length)
  const destacados = computed(() => productos.value.filter((p) => p.destacado).slice(0, 3))
  const categorias = computed(() => {
    const propias = productos.value.map((p) => p.categoria)
    return [...new Set([...CATEGORIAS, ...propias])].sort((a, b) => a.localeCompare(b, 'es'))
  })

  function obtenerPorId(id) {
    const numero = Number(id)
    return productos.value.find((p) => p.id === numero)
  }

  function buscar({ texto = '', categoria = 'Todas', orden = 'relevancia' } = {}) {
    const termino = sinAcentos(texto)
    let resultado = productos.value.filter((p) => {
      const coincideTexto =
        !termino ||
        sinAcentos(`${p.nombre} ${p.descripcion} ${p.categoria}`).includes(termino)
      const coincideCategoria = categoria === 'Todas' || p.categoria === categoria
      return coincideTexto && coincideCategoria
    })

    resultado = [...resultado]

    if (orden === 'precio-asc') resultado.sort((a, b) => a.precio - b.precio)
    if (orden === 'precio-desc') resultado.sort((a, b) => b.precio - a.precio)
    if (orden === 'nombre') resultado.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

    return resultado
  }

  function siguienteId() {
    return Math.max(0, ...productos.value.map((p) => p.id)) + 1
  }

  function crear(datos) {
    const producto = {
      ...normalizar(datos),
      id: siguienteId(),
      creadoEn: new Date().toISOString()
    }
    productos.value.unshift(producto)
    return producto
  }

  function actualizar(id, datos) {
    const indice = productos.value.findIndex((p) => p.id === Number(id))
    if (indice === -1) return null

    const actualizado = {
      ...productos.value[indice],
      ...normalizar(datos)
    }
    productos.value[indice] = actualizado
    useCartStore().sincronizarProducto(actualizado)
    return actualizado
  }

  function eliminar(id) {
    const numero = Number(id)
    const existe = productos.value.some((p) => p.id === numero)
    if (!existe) return false

    productos.value = productos.value.filter((p) => p.id !== numero)
    useCartStore().eliminarProducto(numero)
    return true
  }

  function restablecer() {
    productos.value = structuredClone(PRODUCTOS_INICIALES)
  }

  return {
    productos,
    total,
    categorias,
    destacados,
    obtenerPorId,
    buscar,
    crear,
    actualizar,
    eliminar,
    restablecer
  }
})
