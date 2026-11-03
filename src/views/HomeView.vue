<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import ProductCard from '@/components/ProductCard.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'
import { formatearPrecio } from '@/utils/formato'

const productosStore = useProductsStore()
const carrito = useCartStore()
const { notificar } = useToast()

const { total, destacados, categorias } = storeToRefs(productosStore)
const { totalUnidades } = storeToRefs(carrito)

const productoAEliminar = ref(null)

const estadisticas = computed(() => [
  { valor: total.value, etiqueta: 'Productos en la tienda' },
  { valor: categorias.value.length, etiqueta: 'Categorías disponibles' },
  { valor: totalUnidades.value, etiqueta: 'Unidades en tu carrito' }
])

const productoHeroe = computed(() => destacados.value[0] || null)

function pedirEliminar(producto) {
  productoAEliminar.value = producto
}

function confirmarEliminar() {
  if (!productoAEliminar.value) return
  productosStore.eliminar(productoAEliminar.value.id)
  notificar(`“${productoAEliminar.value.nombre}” se eliminó del catálogo.`, 'info')
  productoAEliminar.value = null
}
</script>

<template>
  <div>
    <section class="hero">
      <div class="container hero__inner">
        <div class="hero__contenido">
          <span class="eyebrow">Nueva colección 2026</span>
          <h1>
            Tecnología que
            <span class="hero__acento">simplifica</span>
            tu día.
          </h1>
          <p class="hero__texto">
            Descubre accesorios y equipos seleccionados para trabajar, crear y disfrutar.
            Explora el catálogo, agrega tus favoritos y gestiona tu compra en segundos.
          </p>
          <div class="hero__acciones">
            <RouterLink to="/productos" class="btn btn--primary btn--lg">
              Explorar productos
              <span aria-hidden="true">→</span>
            </RouterLink>
            <RouterLink to="/carrito" class="btn btn--outline btn--lg">
              Ver carrito
              <span v-if="totalUnidades > 0" class="hero__contador">{{ totalUnidades }}</span>
            </RouterLink>
          </div>
          <ul class="hero__beneficios">
            <li><span aria-hidden="true">✓</span> Envío gratis desde $100</li>
            <li><span aria-hidden="true">✓</span> Garantía de 12 meses</li>
            <li><span aria-hidden="true">✓</span> Compra segura</li>
          </ul>
        </div>

        <div class="hero__visual" aria-hidden="true">
          <div class="hero__blob"></div>
          <div v-if="productoHeroe" class="hero__tarjeta">
            <div class="hero__tarjeta-top">
              <span class="badge badge--primary">★ Producto estrella</span>
              <span class="hero__puntos">•••</span>
            </div>
            <div class="hero__producto">
              <span class="hero__emoji">{{ productoHeroe.icono }}</span>
              <div class="hero__ondas"></div>
            </div>
            <div class="hero__tarjeta-info">
              <div>
                <p class="hero__categoria">{{ productoHeroe.categoria }}</p>
                <h2>{{ productoHeroe.nombre }}</h2>
              </div>
              <span class="hero__precio">{{ formatearPrecio(productoHeroe.precio) }}</span>
            </div>
            <div class="hero__tarjeta-pie">
              <span class="badge badge--success">Disponible</span>
              <RouterLink to="/productos" class="btn btn--soft btn--sm">Ver detalles</RouterLink>
            </div>
          </div>
          <div class="hero__flotante hero__flotante--arriba">
            <span class="hero__flotante-icono">🚚</span>
            <div>
              <strong>Envío gratis</strong>
              <span>En compras +$100</span>
            </div>
          </div>
          <div class="hero__flotante hero__flotante--abajo">
            <span class="hero__flotante-icono">🛡️</span>
            <div>
              <strong>Compra protegida</strong>
              <span>12 meses de garantía</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container estadisticas" aria-label="Resumen de la tienda">
      <div v-for="dato in estadisticas" :key="dato.etiqueta" class="estadistica">
        <strong>{{ dato.valor }}</strong>
        <span>{{ dato.etiqueta }}</span>
      </div>
    </section>

    <section class="container seccion">
      <div class="seccion__encabezado">
        <div>
          <span class="eyebrow">Selección especial</span>
          <h2>Productos destacados</h2>
          <p>Los favoritos de la comunidad, elegidos por su calidad y diseño.</p>
        </div>
        <RouterLink to="/productos" class="btn btn--outline">
          Ver todos los productos
          <span aria-hidden="true">→</span>
        </RouterLink>
      </div>

      <div v-if="destacados.length > 0" class="grilla-productos">
        <ProductCard
          v-for="producto in destacados"
          :key="producto.id"
          :producto="producto"
          @eliminar="pedirEliminar"
        />
      </div>
      <div v-else class="empty-state">
        <span class="empty-state__icono" aria-hidden="true">📦</span>
        <h2>Aún no hay productos destacados</h2>
        <p>Crea un producto y márcalo como destacado para verlo en esta sección.</p>
        <RouterLink to="/productos/crear" class="btn btn--primary">Crear producto</RouterLink>
      </div>
    </section>

    <section class="container seccion">
      <div class="seccion__encabezado seccion__encabezado--centrado">
        <div>
          <span class="eyebrow">Hecho para ti</span>
          <h2>Una tienda ágil y sencilla</h2>
          <p>Todo el flujo de compra, resuelto con una interfaz clara y accesible.</p>
        </div>
      </div>
      <div class="beneficios">
        <article class="beneficio card">
          <span class="beneficio__numero">01</span>
          <span class="beneficio__icono" aria-hidden="true">⚡</span>
          <h3>Gestión inmediata</h3>
          <p>Crea, edita y elimina productos sin recargar la página. Los cambios se guardan al instante.</p>
        </article>
        <article class="beneficio card">
          <span class="beneficio__numero">02</span>
          <span class="beneficio__icono" aria-hidden="true">🛒</span>
          <h3>Carrito inteligente</h3>
          <p>Ajusta cantidades, conoce el total acumulado y conserva tu selección al volver más tarde.</p>
        </article>
        <article class="beneficio card">
          <span class="beneficio__numero">03</span>
          <span class="beneficio__icono" aria-hidden="true">🔎</span>
          <h3>Encuentra rápido</h3>
          <p>Busca por nombre, filtra por categoría y ordena por precio para decidir mejor.</p>
        </article>
      </div>
    </section>

    <section class="container seccion">
      <div class="cta">
        <div>
          <span class="eyebrow eyebrow--claro">¿Listo para empezar?</span>
          <h2>Tu próximo producto favorito está aquí.</h2>
          <p>Explora el catálogo completo o agrega un nuevo artículo a la tienda.</p>
        </div>
        <div class="cta__acciones">
          <RouterLink to="/productos" class="btn btn--lg cta__btn-claro">Ir a productos</RouterLink>
          <RouterLink to="/productos/crear" class="btn btn--lg cta__btn-borde">Crear producto</RouterLink>
        </div>
      </div>
    </section>

    <ConfirmDialog
      :abierto="Boolean(productoAEliminar)"
      titulo="Eliminar producto"
      :mensaje="productoAEliminar ? `“${productoAEliminar.nombre}” se quitará del catálogo y del carrito. Esta acción no se puede deshacer.` : ''"
      etiqueta-confirmar="Sí, eliminar"
      @confirmar="confirmarEliminar"
      @cerrar="productoAEliminar = null"
    />
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
  background:
    radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.1), transparent 42%),
    radial-gradient(circle at 100% 20%, rgba(6, 182, 212, 0.1), transparent 38%),
    linear-gradient(180deg, #fbfbff 0%, var(--bg) 100%);
}

.hero__inner {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: 56px;
  padding: 76px 0 84px;
}

.hero__contenido h1 {
  max-width: 620px;
  font-size: clamp(2.5rem, 5vw, 4.15rem);
  letter-spacing: -0.045em;
}

.hero__acento {
  background: linear-gradient(100deg, var(--primary) 10%, #7c6cf6 50%, var(--accent) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero__texto {
  max-width: 540px;
  margin-top: 20px;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.7;
}

.hero__acciones {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.hero__contador {
  display: grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  border-radius: 999px;
  background: var(--primary);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
}

.hero__beneficios {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin-top: 30px;
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 600;
}

.hero__beneficios li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.hero__beneficios span {
  color: var(--success);
  font-weight: 900;
}

.hero__visual {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 440px;
}

.hero__blob {
  position: absolute;
  width: 430px;
  height: 430px;
  border-radius: 48% 52% 42% 58% / 54% 46% 54% 46%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(6, 182, 212, 0.16));
  filter: blur(2px);
  animation: flotar 9s ease-in-out infinite;
}

.hero__tarjeta {
  position: relative;
  z-index: 2;
  width: min(390px, 100%);
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(12px);
}

.hero__tarjeta-top,
.hero__tarjeta-pie,
.hero__tarjeta-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.hero__puntos {
  color: #b5bbcf;
  letter-spacing: 0.15em;
}

.hero__producto {
  position: relative;
  display: grid;
  place-items: center;
  height: 190px;
  margin: 16px 0;
  overflow: hidden;
  border-radius: 18px;
  background: linear-gradient(145deg, #eef2ff 0%, #e0f7fb 100%);
}

.hero__emoji {
  position: relative;
  z-index: 2;
  font-size: 6.5rem;
  line-height: 1;
  filter: drop-shadow(0 18px 22px rgba(30, 41, 92, 0.2));
  animation: flotar 5s ease-in-out infinite;
}

.hero__ondas {
  position: absolute;
  width: 210px;
  height: 210px;
  border: 1px solid rgba(79, 70, 229, 0.15);
  border-radius: 50%;
  box-shadow: 0 0 0 32px rgba(79, 70, 229, 0.05), 0 0 0 64px rgba(79, 70, 229, 0.03);
}

.hero__categoria {
  color: var(--primary);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero__tarjeta-info h2 {
  margin-top: 2px;
  font-size: 1.12rem;
}

.hero__precio {
  flex-shrink: 0;
  font-size: 1.18rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.hero__tarjeta-pie {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.hero__flotante {
  position: absolute;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: var(--shadow);
  animation: flotar 6s ease-in-out infinite;
}

.hero__flotante strong,
.hero__flotante span {
  display: block;
}

.hero__flotante strong {
  color: var(--ink);
  font-size: 0.78rem;
}

.hero__flotante span {
  color: var(--muted);
  font-size: 0.68rem;
}

.hero__flotante-icono {
  display: grid !important;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: var(--primary-soft);
  font-size: 1rem !important;
}

.hero__flotante--arriba {
  top: 26px;
  right: -8px;
}

.hero__flotante--abajo {
  bottom: 26px;
  left: -14px;
  animation-delay: -2.5s;
}

.estadisticas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: -26px;
  padding: 22px 28px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--surface);
  box-shadow: var(--shadow);
  position: relative;
  z-index: 4;
}

.estadistica {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 10px;
  padding: 0 20px;
  text-align: center;
}

.estadistica + .estadistica {
  border-left: 1px solid var(--border);
}

.estadistica strong {
  font-size: 1.8rem;
  letter-spacing: -0.04em;
}

.estadistica span {
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 600;
}

.seccion {
  padding-top: 76px;
}

.seccion__encabezado {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.seccion__encabezado h2 {
  font-size: clamp(1.7rem, 3vw, 2.3rem);
}

.seccion__encabezado p:not(.eyebrow) {
  margin-top: 8px;
  color: var(--muted);
  font-size: 0.94rem;
}

.seccion__encabezado--centrado {
  justify-content: center;
  text-align: center;
}

.seccion__encabezado--centrado p:not(.eyebrow) {
  max-width: 540px;
  margin-inline: auto;
}

.grilla-productos {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.beneficios {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.beneficio {
  position: relative;
  padding: 28px;
  overflow: hidden;
}

.beneficio__numero {
  position: absolute;
  top: 16px;
  right: 20px;
  color: #edeef7;
  font-size: 2.6rem;
  font-weight: 800;
  letter-spacing: -0.05em;
}

.beneficio__icono {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: 18px;
  border-radius: 14px;
  background: var(--primary-soft);
  font-size: 1.3rem;
}

.beneficio h3 {
  margin-bottom: 8px;
  font-size: 1.08rem;
}

.beneficio p {
  color: var(--muted);
  font-size: 0.86rem;
}

.cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 44px 48px;
  overflow: hidden;
  border-radius: 26px;
  background:
    radial-gradient(circle at 100% 0%, rgba(34, 211, 238, 0.22), transparent 45%),
    radial-gradient(circle at 0% 100%, rgba(124, 108, 246, 0.3), transparent 45%),
    #141830;
  color: #fff;
  box-shadow: var(--shadow-lg);
}

.eyebrow--claro {
  color: #a5b4fc;
}

.cta h2 {
  max-width: 600px;
  font-size: clamp(1.6rem, 2.8vw, 2.2rem);
}

.cta p {
  margin-top: 8px;
  color: #aab0c8;
  font-size: 0.9rem;
}

.cta__acciones {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex-shrink: 0;
}

.cta__btn-claro {
  background: #fff;
  color: var(--ink);
}

.cta__btn-claro:hover {
  background: #eef0ff;
}

.cta__btn-borde {
  border-color: rgba(255, 255, 255, 0.28);
  color: #fff;
}

.cta__btn-borde:hover {
  background: rgba(255, 255, 255, 0.08);
}

@keyframes flotar {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-9px);
  }
}

@media (max-width: 980px) {
  .hero__inner {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 56px 0 72px;
  }

  .hero__visual {
    min-height: 400px;
  }

  .hero__flotante--arriba {
    right: 2%;
  }

  .hero__flotante--abajo {
    left: 2%;
  }

  .grilla-productos,
  .beneficios {
    grid-template-columns: repeat(2, 1fr);
  }

  .cta {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .hero__visual {
    min-height: 360px;
  }

  .hero__blob {
    width: 320px;
    height: 320px;
  }

  .hero__flotante {
    display: none;
  }

  .estadisticas {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 18px;
    margin-top: -20px;
  }

  .estadistica {
    justify-content: space-between;
    padding: 0;
  }

  .estadistica + .estadistica {
    padding-top: 12px;
    border-top: 1px solid var(--border);
    border-left: 0;
  }

  .seccion {
    padding-top: 52px;
  }

  .seccion__encabezado {
    align-items: flex-start;
    flex-direction: column;
  }

  .grilla-productos,
  .beneficios {
    grid-template-columns: 1fr;
  }

  .cta {
    padding: 30px 24px;
  }

  .cta__acciones {
    width: 100%;
  }

  .cta__acciones .btn {
    flex: 1;
  }
}
</style>
