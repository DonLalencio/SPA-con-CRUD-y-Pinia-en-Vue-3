<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'
import { formatearPrecio } from '@/utils/formato'

const carrito = useCartStore()
const { items, estaVacio, totalUnidades, totalPrecio } = storeToRefs(carrito)
const { notificar } = useToast()

const dialogoVaciar = ref(false)
const compraFinalizada = ref(false)

function incrementar(item) {
  const incrementado = carrito.incrementar(item.productoId)
  if (!incrementado) {
    notificar(`Solo hay ${item.stock} unidades disponibles de este producto.`, 'info')
  }
}

function quitar(item) {
  carrito.quitar(item.productoId)
  notificar(`“${item.nombre}” se quitó del carrito.`, 'info')
}

function vaciarCarrito() {
  carrito.vaciar()
  notificar('El carrito se vació correctamente.', 'info')
}

function finalizarCompra() {
  if (estaVacio.value) return
  compraFinalizada.value = true
  carrito.vaciar()
  notificar('¡Compra simulada con éxito! Gracias por tu pedido.', 'exito')
}
</script>

<template>
  <div class="page container">
    <header class="page-header">
      <div>
        <span class="eyebrow">Tu selección</span>
        <h1>Carrito de compras</h1>
        <p class="muted">
          Revisa tus productos, ajusta las cantidades y confirma el total antes de finalizar.
        </p>
      </div>
      <RouterLink to="/productos" class="btn btn--outline">← Seguir comprando</RouterLink>
    </header>

    <div v-if="estaVacio" class="empty-state carrito-vacio">
      <span class="empty-state__icono" aria-hidden="true">🛒</span>
      <h2>{{ compraFinalizada ? '¡Gracias por tu compra!' : 'Tu carrito está vacío' }}</h2>
      <p v-if="compraFinalizada">
        Tu pedido simulado se registró correctamente. Puedes seguir explorando el catálogo.
      </p>
      <p v-else>
        Todavía no has agregado productos. Explora el catálogo y encuentra algo que te guste.
      </p>
      <RouterLink to="/productos" class="btn btn--primary">Explorar productos</RouterLink>
    </div>

    <div v-else class="carrito-layout">
      <section class="carrito-lista" aria-label="Productos en el carrito">
        <div class="carrito-lista__encabezado">
          <h2>Productos <span class="badge">{{ totalUnidades }} {{ totalUnidades === 1 ? 'unidad' : 'unidades' }}</span></h2>
          <button type="button" class="btn btn--danger-soft btn--sm" @click="dialogoVaciar = true">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Vaciar carrito
          </button>
        </div>

        <ul class="items">
          <li v-for="item in items" :key="item.productoId" class="item card">
            <div class="item__visual" aria-hidden="true">{{ item.icono }}</div>

            <div class="item__info">
              <span class="badge">{{ item.categoria }}</span>
              <h3>{{ item.nombre }}</h3>
              <p class="item__precio-unitario">{{ formatearPrecio(item.precio) }} c/u</p>
              <RouterLink :to="`/productos/${item.productoId}`" class="item__editar">
                Editar producto
              </RouterLink>
            </div>

            <div class="item__cantidad">
              <span class="item__etiqueta">Cantidad</span>
              <div class="stepper">
                <button
                  type="button"
                  class="stepper__boton"
                  :aria-label="`Quitar una unidad de ${item.nombre}`"
                  @click="carrito.disminuir(item.productoId)"
                >
                  −
                </button>
                <span class="stepper__valor" aria-live="polite">{{ item.cantidad }}</span>
                <button
                  type="button"
                  class="stepper__boton"
                  :aria-label="`Agregar una unidad de ${item.nombre}`"
                  :disabled="item.cantidad >= item.stock"
                  @click="incrementar(item)"
                >
                  ＋
                </button>
              </div>
              <span v-if="item.cantidad >= item.stock" class="item__limite">
                Máximo disponible
              </span>
            </div>

            <div class="item__subtotal">
              <span class="item__etiqueta">Subtotal</span>
              <strong>{{ formatearPrecio(item.precio * item.cantidad) }}</strong>
            </div>

            <button
              type="button"
              class="btn btn--ghost btn--icon item__quitar"
              :aria-label="`Eliminar ${item.nombre} del carrito`"
              title="Eliminar del carrito"
              @click="quitar(item)"
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" stroke-linecap="round" />
              </svg>
            </button>
          </li>
        </ul>

        <RouterLink to="/productos" class="carrito-lista__seguir">
          <span aria-hidden="true">←</span> Agregar más productos
        </RouterLink>
      </section>

      <aside class="resumen card" aria-label="Resumen del pedido">
        <h2>Resumen del pedido</h2>

        <dl class="resumen__lineas">
          <div>
            <dt>Productos ({{ totalUnidades }})</dt>
            <dd>{{ formatearPrecio(totalPrecio) }}</dd>
          </div>
          <div>
            <dt>Envío</dt>
            <dd class="resumen__gratis">Gratis</dd>
          </div>
          <div>
            <dt>Impuestos</dt>
            <dd>Incluidos</dd>
          </div>
        </dl>

        <div class="resumen__total">
          <span>Total acumulado</span>
          <strong>{{ formatearPrecio(totalPrecio) }}</strong>
        </div>

        <button type="button" class="btn btn--primary btn--lg btn--block" @click="finalizarCompra">
          Finalizar compra
          <span aria-hidden="true">→</span>
        </button>
        <RouterLink to="/productos" class="btn btn--ghost btn--block resumen__seguir">
          Seguir comprando
        </RouterLink>

        <div class="resumen__nota">
          <span aria-hidden="true">🔒</span>
          <p>Compra simulada con fines académicos. No se procesan pagos reales.</p>
        </div>

        <ul class="resumen__garantias">
          <li><span aria-hidden="true">✓</span> Garantía de 12 meses</li>
          <li><span aria-hidden="true">✓</span> Devolución sin costo</li>
          <li><span aria-hidden="true">✓</span> Soporte personalizado</li>
        </ul>
      </aside>
    </div>

    <ConfirmDialog
      :abierto="dialogoVaciar"
      titulo="Vaciar carrito"
      mensaje="Se eliminarán todos los productos de tu carrito. ¿Deseas continuar?"
      etiqueta-confirmar="Sí, vaciar"
      @confirmar="vaciarCarrito"
      @cerrar="dialogoVaciar = false"
    />
  </div>
</template>

<style scoped>
.page-header p {
  max-width: 560px;
  margin-top: 8px;
  font-size: 0.92rem;
}

.carrito-vacio {
  padding-block: 84px;
}

.carrito-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(320px, 0.8fr);
  align-items: start;
  gap: 24px;
}

.carrito-lista__encabezado {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.carrito-lista__encabezado h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.05rem;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item {
  position: relative;
  display: grid;
  grid-template-columns: 78px minmax(0, 1fr) auto auto 36px;
  align-items: center;
  gap: 18px;
  padding: 14px;
}

.item__visual {
  display: grid;
  place-items: center;
  width: 78px;
  height: 78px;
  border-radius: 14px;
  background: linear-gradient(145deg, #eef2ff, #e0f7fb);
  font-size: 2.1rem;
}

.item__info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  min-width: 0;
}

.item__info h3 {
  overflow: hidden;
  max-width: 100%;
  font-size: 0.98rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item__precio-unitario {
  color: var(--muted);
  font-size: 0.78rem;
}

.item__editar {
  margin-top: 2px;
  color: var(--primary);
  font-size: 0.74rem;
  font-weight: 700;
}

.item__editar:hover {
  text-decoration: underline;
}

.item__etiqueta {
  display: block;
  margin-bottom: 4px;
  color: var(--muted);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
}

.stepper__boton {
  display: grid;
  place-items: center;
  width: 30px;
  height: 32px;
  border: 0;
  background: var(--surface);
  color: var(--ink-soft);
  font-size: 0.95rem;
  font-weight: 700;
}

.stepper__boton:hover:not(:disabled) {
  background: var(--surface-soft);
}

.stepper__boton:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.stepper__valor {
  display: grid;
  place-items: center;
  min-width: 32px;
  height: 32px;
  border-inline: 1px solid var(--border);
  font-size: 0.84rem;
  font-weight: 700;
}

.item__limite {
  display: block;
  margin-top: 4px;
  color: var(--warning);
  font-size: 0.64rem;
  font-weight: 600;
}

.item__subtotal {
  min-width: 86px;
  text-align: right;
}

.item__subtotal strong {
  font-size: 1rem;
  letter-spacing: -0.02em;
}

.item__quitar {
  color: var(--muted);
}

.item__quitar:hover {
  background: var(--danger-soft);
  color: var(--danger);
}

.carrito-lista__seguir {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 20px;
  color: var(--primary);
  font-size: 0.84rem;
  font-weight: 700;
}

.carrito-lista__seguir:hover {
  text-decoration: underline;
}

.resumen {
  position: sticky;
  top: 94px;
  padding: 24px;
}

.resumen h2 {
  font-size: 1.12rem;
}

.resumen__lineas {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 18px 0;
  padding-bottom: 18px;
  border-bottom: 1px dashed var(--border);
}

.resumen__lineas div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--muted);
  font-size: 0.84rem;
}

.resumen__lineas dd {
  margin: 0;
  color: var(--ink-soft);
  font-weight: 600;
}

.resumen__gratis {
  color: var(--success) !important;
}

.resumen__total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 20px;
}

.resumen__total span {
  font-size: 0.88rem;
  font-weight: 700;
}

.resumen__total strong {
  font-size: 1.55rem;
  letter-spacing: -0.04em;
}

.resumen__seguir {
  margin-top: 6px;
}

.resumen__nota {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--surface-soft);
}

.resumen__nota p {
  color: var(--muted);
  font-size: 0.72rem;
  line-height: 1.5;
}

.resumen__garantias {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.resumen__garantias li {
  display: flex;
  gap: 7px;
  color: var(--muted);
  font-size: 0.76rem;
}

.resumen__garantias span {
  color: var(--success);
  font-weight: 900;
}

@media (max-width: 980px) {
  .carrito-layout {
    grid-template-columns: 1fr;
  }

  .resumen {
    position: static;
  }
}

@media (max-width: 700px) {
  .item {
    grid-template-columns: 64px minmax(0, 1fr) 32px;
    gap: 12px;
    padding: 12px;
  }

  .item__visual {
    width: 64px;
    height: 64px;
    font-size: 1.7rem;
  }

  .item__cantidad {
    grid-column: 2;
  }

  .item__subtotal {
    grid-column: 2;
    text-align: left;
  }

  .item__quitar {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .carrito-lista__encabezado {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
