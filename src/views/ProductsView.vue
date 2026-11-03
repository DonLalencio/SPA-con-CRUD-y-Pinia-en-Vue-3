<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import ProductCard from '@/components/ProductCard.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useProductsStore } from '@/stores/products'
import { useToast } from '@/composables/useToast'

const productosStore = useProductsStore()
const { total, categorias } = storeToRefs(productosStore)
const { notificar } = useToast()

const texto = ref('')
const categoria = ref('Todas')
const orden = ref('relevancia')
const productoAEliminar = ref(null)

const productosFiltrados = computed(() =>
  productosStore.buscar({
    texto: texto.value,
    categoria: categoria.value,
    orden: orden.value
  })
)

const hayFiltros = computed(
  () => texto.value !== '' || categoria.value !== 'Todas' || orden.value !== 'relevancia'
)

function limpiarFiltros() {
  texto.value = ''
  categoria.value = 'Todas'
  orden.value = 'relevancia'
}

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
  <div class="page container">
    <header class="page-header">
      <div>
        <span class="eyebrow">Catálogo</span>
        <h1>Nuestros productos</h1>
        <p class="muted">
          {{ total }} {{ total === 1 ? 'producto disponible' : 'productos disponibles' }}.
          Gestiona el inventario o agrega tus favoritos al carrito.
        </p>
      </div>
      <RouterLink to="/productos/crear" class="btn btn--primary">
        <span aria-hidden="true">＋</span>
        Nuevo producto
      </RouterLink>
    </header>

    <section class="barra-filtros card" aria-label="Filtros de productos">
      <div class="buscador">
        <span class="buscador__icono" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" stroke-linecap="round" />
          </svg>
        </span>
        <label for="buscar-producto" class="sr-only">Buscar producto</label>
        <input
          id="buscar-producto"
          v-foco
          v-model.trim="texto"
          type="search"
          class="input buscador__input"
          placeholder="Buscar por nombre, categoría o descripción…"
        />
      </div>

      <div class="filtro">
        <label for="filtro-categoria" class="sr-only">Filtrar por categoría</label>
        <select id="filtro-categoria" v-model="categoria" class="select">
          <option value="Todas">Todas las categorías</option>
          <option v-for="item in categorias" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>

      <div class="filtro">
        <label for="filtro-orden" class="sr-only">Ordenar productos</label>
        <select id="filtro-orden" v-model="orden" class="select">
          <option value="relevancia">Destacados primero</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre: A–Z</option>
        </select>
      </div>

      <button v-if="hayFiltros" type="button" class="btn btn--ghost btn--sm" @click="limpiarFiltros">
        Limpiar filtros
      </button>
    </section>

    <div class="resultados">
      <p>
        <strong>{{ productosFiltrados.length }}</strong>
        {{ productosFiltrados.length === 1 ? 'resultado' : 'resultados' }}
        <span v-if="hayFiltros" class="muted">con los filtros aplicados</span>
      </p>
      <span v-if="hayFiltros" class="badge badge--primary">
        Filtro activo: {{ categoria === 'Todas' ? 'todas' : categoria }}
      </span>
    </div>

    <div v-if="productosFiltrados.length > 0" class="grilla-productos">
      <ProductCard
        v-for="producto in productosFiltrados"
        :key="producto.id"
        :producto="producto"
        @eliminar="pedirEliminar"
      />
    </div>

    <div v-else class="empty-state">
      <span class="empty-state__icono" aria-hidden="true">🔍</span>
      <template v-if="hayFiltros">
        <h2>No encontramos productos</h2>
        <p>Prueba con otro término de búsqueda o cambia la categoría seleccionada.</p>
        <button type="button" class="btn btn--primary" @click="limpiarFiltros">
          Limpiar filtros
        </button>
      </template>
      <template v-else>
        <h2>El catálogo está vacío</h2>
        <p>Aún no hay productos registrados. Crea el primero para comenzar a vender.</p>
        <RouterLink to="/productos/crear" class="btn btn--primary">Crear mi primer producto</RouterLink>
      </template>
    </div>

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
.page-header p {
  max-width: 560px;
  margin-top: 8px;
  font-size: 0.92rem;
}

.barra-filtros {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 200px 200px auto;
  align-items: center;
  gap: 12px;
  padding: 14px;
  margin-bottom: 22px;
}

.buscador {
  position: relative;
}

.buscador__icono {
  position: absolute;
  top: 50%;
  left: 13px;
  color: var(--muted);
  transform: translateY(-50%);
  pointer-events: none;
}

.buscador__input {
  padding-left: 40px;
}

.resultados {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  color: var(--muted);
  font-size: 0.84rem;
}

.resultados strong {
  color: var(--ink);
}

.grilla-productos {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

@media (max-width: 1080px) {
  .grilla-productos {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .barra-filtros {
    grid-template-columns: 1fr 1fr;
  }

  .buscador {
    grid-column: 1 / -1;
  }
}

@media (max-width: 820px) {
  .grilla-productos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .barra-filtros {
    grid-template-columns: 1fr;
  }

  .grilla-productos {
    grid-template-columns: 1fr;
  }

  .resultados {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
