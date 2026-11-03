<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'
import { formatearPrecio } from '@/utils/formato'

const props = defineProps({
  producto: {
    type: Object,
    required: true
  }
})

defineEmits(['eliminar'])

const carrito = useCartStore()
const { notificar } = useToast()

const paletas = {
  Audio: ['#eef2ff', '#e0e7ff'],
  Computación: ['#ecfeff', '#cffafe'],
  Accesorios: ['#fdf2f8', '#fce7f3'],
  Gaming: ['#f5f3ff', '#ede9fe'],
  Fotografía: ['#f0fdf4', '#dcfce7'],
  Hogar: ['#fff7ed', '#ffedd5']
}

const fondoIcono = computed(() => {
  const paleta = paletas[props.producto.categoria] || ['#f4f5fb', '#e9ebf7']
  return {
    background: `linear-gradient(145deg, ${paleta[0]} 0%, ${paleta[1]} 100%)`
  }
})

const agotado = computed(() => props.producto.stock <= 0)

function agregarAlCarrito() {
  const agregado = carrito.agregar(props.producto)
  if (agregado) {
    notificar(`“${props.producto.nombre}” se agregó al carrito.`, 'exito')
  } else {
    notificar('Este producto no tiene stock disponible.', 'error')
  }
}
</script>

<template>
  <article class="producto card">
    <div class="producto__visual" :style="fondoIcono">
      <span class="producto__categoria badge">{{ producto.categoria }}</span>
      <span v-if="producto.destacado" class="producto__destacado badge badge--primary">
        ★ Destacado
      </span>
      <span class="producto__icono" aria-hidden="true">{{ producto.icono }}</span>
    </div>

    <div class="producto__cuerpo">
      <div class="producto__encabezado">
        <h3 class="producto__nombre">{{ producto.nombre }}</h3>
        <p class="producto__descripcion">{{ producto.descripcion }}</p>
      </div>

      <div class="producto__meta">
        <span class="price">{{ formatearPrecio(producto.precio) }}</span>
        <span v-if="agotado" class="badge badge--danger">Agotado</span>
        <span v-else-if="producto.stock <= 5" class="badge badge--warning">
          Últimas {{ producto.stock }} unidades
        </span>
        <span v-else class="badge badge--success">{{ producto.stock }} disponibles</span>
      </div>

      <div class="producto__acciones">
        <button
          type="button"
          class="btn btn--primary btn--sm producto__agregar"
          :disabled="agotado"
          @click="agregarAlCarrito"
        >
          <span aria-hidden="true">🛒</span>
          {{ agotado ? 'Sin stock' : 'Agregar' }}
        </button>
        <RouterLink
          :to="`/productos/${producto.id}`"
          class="btn btn--outline btn--sm"
          :aria-label="`Editar ${producto.nombre}`"
        >
          Editar
        </RouterLink>
        <button
          type="button"
          class="btn btn--danger-soft btn--icon"
          :aria-label="`Eliminar ${producto.nombre}`"
          title="Eliminar producto"
          @click="$emit('eliminar', producto)"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.producto {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.producto:hover {
  transform: translateY(-4px);
  border-color: #d6d9ea;
  box-shadow: var(--shadow);
}

.producto__visual {
  position: relative;
  display: grid;
  place-items: center;
  height: 158px;
  border-bottom: 1px solid rgba(228, 231, 241, 0.7);
}

.producto__categoria {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(6px);
}

.producto__destacado {
  position: absolute;
  top: 14px;
  right: 14px;
}

.producto__icono {
  font-size: 3.7rem;
  line-height: 1;
  filter: drop-shadow(0 12px 16px rgba(17, 21, 42, 0.14));
  transition: transform 0.25s ease;
}

.producto:hover .producto__icono {
  transform: scale(1.08) rotate(-3deg);
}

.producto__cuerpo {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
}

.producto__encabezado {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.producto__nombre {
  font-size: 1.06rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.producto__descripcion {
  display: -webkit-box;
  overflow: hidden;
  color: var(--muted);
  font-size: 0.83rem;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.producto__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
}

.producto__acciones {
  display: flex;
  gap: 8px;
}

.producto__agregar {
  flex: 1;
}
</style>
