import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const CLAVE_CARRITO = 'nova-store:carrito:v1'

function cargarCarrito() {
  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO)
    if (!guardado) return []
    const datos = JSON.parse(guardado)
    return Array.isArray(datos) ? datos : []
  } catch {
    return []
  }
}

/**
 * Store del carrito.
 * Guarda una instantánea de cada producto y concentra todas las operaciones:
 * agregar, incrementar, disminuir, quitar, vaciar y calcular totales.
 */
export const useCartStore = defineStore('carrito', () => {
  const items = ref(cargarCarrito())

  watch(
    items,
    (valor) => {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(valor))
    },
    { deep: true }
  )

  const estaVacio = computed(() => items.value.length === 0)
  const totalUnidades = computed(() =>
    items.value.reduce((total, item) => total + item.cantidad, 0)
  )
  const totalPrecio = computed(() =>
    items.value.reduce((total, item) => total + item.precio * item.cantidad, 0)
  )

  function agregar(producto, cantidad = 1) {
    const stock = Math.max(0, Number(producto.stock) || 0)
    if (stock === 0) return false

    const existente = items.value.find((item) => item.productoId === producto.id)

    if (existente) {
      existente.cantidad = Math.min(existente.cantidad + cantidad, stock)
      existente.precio = producto.precio
      existente.nombre = producto.nombre
      existente.icono = producto.icono
      existente.stock = stock
    } else {
      items.value.push({
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        icono: producto.icono,
        categoria: producto.categoria,
        stock,
        cantidad: Math.min(cantidad, stock)
      })
    }
    return true
  }

  function incrementar(productoId) {
    const item = items.value.find((i) => i.productoId === productoId)
    if (!item || item.cantidad >= item.stock) return false
    item.cantidad += 1
    return true
  }

  function disminuir(productoId) {
    const item = items.value.find((i) => i.productoId === productoId)
    if (!item) return
    if (item.cantidad <= 1) {
      quitar(productoId)
    } else {
      item.cantidad -= 1
    }
  }

  function quitar(productoId) {
    items.value = items.value.filter((item) => item.productoId !== productoId)
  }

  function vaciar() {
    items.value = []
  }

  /** Mantiene sincronizados nombre, precio y stock cuando un producto se edita. */
  function sincronizarProducto(producto) {
    const item = items.value.find((i) => i.productoId === producto.id)
    if (!item) return
    item.nombre = producto.nombre
    item.precio = producto.precio
    item.icono = producto.icono
    item.categoria = producto.categoria
    item.stock = producto.stock

    if (producto.stock <= 0) {
      quitar(producto.id)
    } else {
      item.cantidad = Math.min(item.cantidad, producto.stock)
    }
  }

  /** Se invoca desde el store de productos al eliminar un producto. */
  function eliminarProducto(productoId) {
    quitar(productoId)
  }

  return {
    items,
    estaVacio,
    totalUnidades,
    totalPrecio,
    agregar,
    incrementar,
    disminuir,
    quitar,
    vaciar,
    sincronizarProducto,
    eliminarProducto
  }
})
