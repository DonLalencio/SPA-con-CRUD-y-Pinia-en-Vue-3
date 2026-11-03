<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ICONOS, useProductsStore } from '@/stores/products'
import { useToast } from '@/composables/useToast'
import { formatearPrecio } from '@/utils/formato'

const props = defineProps({
  id: { type: [String, Number], default: undefined }
})

const router = useRouter()
const productosStore = useProductsStore()
const { categorias } = storeToRefs(productosStore)
const { notificar } = useToast()

const esEdicion = computed(() => props.id !== undefined && props.id !== '')

function formularioVacio() {
  return {
    nombre: '',
    precio: '',
    categoria: 'Audio',
    descripcion: '',
    stock: 1,
    icono: '🎧',
    destacado: false
  }
}

const formulario = reactive(formularioVacio())
const errores = reactive({})
const noEncontrado = ref(false)

function cargarFormulario() {
  if (!esEdicion.value) {
    Object.assign(formulario, formularioVacio())
    noEncontrado.value = false
    return
  }

  const producto = productosStore.obtenerPorId(props.id)
  if (!producto) {
    noEncontrado.value = true
    return
  }

  noEncontrado.value = false
  Object.assign(formulario, {
    nombre: producto.nombre,
    precio: Number(producto.precio).toFixed(2),
    categoria: producto.categoria,
    descripcion: producto.descripcion,
    stock: producto.stock,
    icono: producto.icono,
    destacado: producto.destacado
  })
}

watch(() => props.id, cargarFormulario, { immediate: true })

const titulo = computed(() => (esEdicion.value ? 'Editar producto' : 'Crear producto'))

const vistaPrevia = computed(() => ({
  nombre: formulario.nombre || 'Nombre del producto',
  precio: formulario.precio,
  categoria: formulario.categoria || 'Categoría',
  descripcion: formulario.descripcion || 'Aquí aparecerá la descripción del producto.',
  stock: Number(formulario.stock) || 0,
  icono: formulario.icono
}))

const precioValido = computed(() => Number(formulario.precio) > 0)

function limpiarErrores() {
  Object.keys(errores).forEach((clave) => delete errores[clave])
}

function validar() {
  limpiarErrores()

  if (!formulario.nombre || formulario.nombre.trim().length < 3) {
    errores.nombre = 'Escribe un nombre de al menos 3 caracteres.'
  }
  if (!precioValido.value) {
    errores.precio = 'El precio debe ser un número mayor que 0.'
  }
  if (!formulario.categoria) {
    errores.categoria = 'Selecciona una categoría.'
  }
  if (formulario.stock === '' || Number(formulario.stock) < 0 || !Number.isInteger(Number(formulario.stock))) {
    errores.stock = 'El stock debe ser un número entero igual o mayor que 0.'
  }
  if (formulario.descripcion.length > 240) {
    errores.descripcion = 'La descripción no puede superar los 240 caracteres.'
  }

  return Object.keys(errores).length === 0
}

function guardar() {
  if (!validar()) {
    notificar('Revisa los campos marcados antes de guardar.', 'error')
    return
  }

  if (esEdicion.value) {
    const actualizado = productosStore.actualizar(props.id, formulario)
    if (!actualizado) {
      notificar('No encontramos el producto que intentas editar.', 'error')
      return
    }
    notificar(`“${actualizado.nombre}” se actualizó correctamente.`, 'exito')
  } else {
    const creado = productosStore.crear(formulario)
    notificar(`“${creado.nombre}” se agregó al catálogo.`, 'exito')
  }

  router.push({ name: 'productos' })
}

function cancelar() {
  router.push({ name: 'productos' })
}
</script>

<template>
  <div class="page container">
    <div v-if="noEncontrado" class="empty-state">
      <span class="empty-state__icono" aria-hidden="true">🧭</span>
      <h1>Producto no encontrado</h1>
      <p>El producto que intentas editar no existe o fue eliminado del catálogo.</p>
      <RouterLink to="/productos" class="btn btn--primary">Volver a productos</RouterLink>
    </div>

    <template v-else>
      <header class="page-header">
        <div>
          <span class="eyebrow">{{ esEdicion ? 'Actualizar catálogo' : 'Nuevo artículo' }}</span>
          <h1>{{ titulo }}</h1>
          <p class="muted">
            {{
              esEdicion
                ? 'Modifica la información del producto y guarda los cambios.'
                : 'Completa la información para publicar un nuevo producto en la tienda.'
            }}
          </p>
        </div>
        <RouterLink to="/productos" class="btn btn--ghost">← Volver al catálogo</RouterLink>
      </header>

      <div class="formulario-layout">
        <form class="formulario card" novalidate @submit.prevent="guardar">
          <section class="formulario__seccion">
            <div class="formulario__seccion-titulo">
              <span class="formulario__paso">1</span>
              <div>
                <h2>Información básica</h2>
                <p>El nombre y la descripción que verán los clientes.</p>
              </div>
            </div>

            <div class="campos">
              <div class="field campo--completo">
                <label for="nombre" class="label">Nombre del producto</label>
                <input
                  id="nombre"
                  v-foco
                  v-model.trim="formulario.nombre"
                  type="text"
                  class="input"
                  :class="{ 'input--error': errores.nombre }"
                  placeholder="Ej. Auriculares Nova Pulse"
                  maxlength="60"
                  :aria-invalid="Boolean(errores.nombre)"
                />
                <p v-if="errores.nombre" class="field__error" role="alert">{{ errores.nombre }}</p>
                <p v-else class="field__hint">{{ formulario.nombre.length }}/60 caracteres</p>
              </div>

              <div class="field campo--completo">
                <label for="descripcion" class="label">
                  Descripción
                  <span class="label__opcional">Opcional</span>
                </label>
                <textarea
                  id="descripcion"
                  v-model.trim="formulario.descripcion"
                  class="textarea"
                  :class="{ 'textarea--error': errores.descripcion }"
                  placeholder="Describe las características más importantes del producto…"
                  maxlength="240"
                ></textarea>
                <p v-if="errores.descripcion" class="field__error" role="alert">{{ errores.descripcion }}</p>
                <p v-else class="field__hint">{{ formulario.descripcion.length }}/240 caracteres</p>
              </div>
            </div>
          </section>

          <section class="formulario__seccion">
            <div class="formulario__seccion-titulo">
              <span class="formulario__paso">2</span>
              <div>
                <h2>Precio e inventario</h2>
                <p>Define el valor de venta y las unidades disponibles.</p>
              </div>
            </div>

            <div class="campos campos--dos">
              <div class="field">
                <label for="precio" class="label">Precio (USD)</label>
                <div class="input-prefijo">
                  <span aria-hidden="true">$</span>
                  <input
                    id="precio"
                    v-model.number="formulario.precio"
                    type="number"
                    class="input"
                    :class="{ 'input--error': errores.precio }"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    :aria-invalid="Boolean(errores.precio)"
                  />
                </div>
                <p v-if="errores.precio" class="field__error" role="alert">{{ errores.precio }}</p>
              </div>

              <div class="field">
                <label for="stock" class="label">Stock disponible</label>
                <input
                  id="stock"
                  v-model.number="formulario.stock"
                  type="number"
                  class="input"
                  :class="{ 'input--error': errores.stock }"
                  min="0"
                  step="1"
                  :aria-invalid="Boolean(errores.stock)"
                />
                <p v-if="errores.stock" class="field__error" role="alert">{{ errores.stock }}</p>
              </div>

              <div class="field">
                <label for="categoria" class="label">Categoría</label>
                <select
                  id="categoria"
                  v-model="formulario.categoria"
                  class="select"
                  :class="{ 'select--error': errores.categoria }"
                >
                  <option v-for="item in categorias" :key="item" :value="item">{{ item }}</option>
                </select>
                <p v-if="errores.categoria" class="field__error" role="alert">{{ errores.categoria }}</p>
              </div>

              <div class="field">
                <span class="label">Visibilidad</span>
                <label class="interruptor">
                  <input v-model="formulario.destacado" type="checkbox" class="sr-only" />
                  <span class="interruptor__pista" aria-hidden="true">
                    <span class="interruptor__bolita"></span>
                  </span>
                  <span>
                    <strong>Producto destacado</strong>
                    <small>Aparecerá en la página de inicio</small>
                  </span>
                </label>
              </div>
            </div>
          </section>

          <section class="formulario__seccion">
            <div class="formulario__seccion-titulo">
              <span class="formulario__paso">3</span>
              <div>
                <h2>Apariencia</h2>
                <p>Elige el ícono que mejor represente al producto.</p>
              </div>
            </div>

            <div class="field">
              <span class="label">Ícono del producto</span>
              <div class="iconos" role="radiogroup" aria-label="Ícono del producto">
                <button
                  v-for="icono in ICONOS"
                  :key="icono"
                  type="button"
                  class="icono"
                  :class="{ 'icono--activo': formulario.icono === icono }"
                  :aria-pressed="formulario.icono === icono"
                  @click="formulario.icono = icono"
                >
                  {{ icono }}
                </button>
              </div>
            </div>
          </section>

          <div class="formulario__acciones">
            <button type="button" class="btn btn--outline" @click="cancelar">Cancelar</button>
            <button type="submit" class="btn btn--primary">
              {{ esEdicion ? 'Guardar cambios' : 'Crear producto' }}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>

        <aside class="vista-previa">
          <div class="vista-previa__etiqueta">Vista previa en vivo</div>
          <div class="tarjeta-previa card">
            <div class="tarjeta-previa__visual">
              <span class="badge">{{ vistaPrevia.categoria }}</span>
              <span v-if="formulario.destacado" class="tarjeta-previa__estrella badge badge--primary">
                ★ Destacado
              </span>
              <span class="tarjeta-previa__icono" aria-hidden="true">{{ vistaPrevia.icono }}</span>
            </div>
            <div class="tarjeta-previa__cuerpo">
              <h2>{{ vistaPrevia.nombre }}</h2>
              <p>{{ vistaPrevia.descripcion }}</p>
              <div class="tarjeta-previa__pie">
                <span class="price">{{ formatearPrecio(vistaPrevia.precio) }}</span>
                <span class="badge" :class="vistaPrevia.stock > 0 ? 'badge--success' : 'badge--danger'">
                  {{ vistaPrevia.stock > 0 ? `${vistaPrevia.stock} en stock` : 'Agotado' }}
                </span>
              </div>
            </div>
          </div>

          <div class="consejos">
            <h2>Consejos para publicar</h2>
            <ul>
              <li><span aria-hidden="true">✓</span> Usa un nombre claro y fácil de recordar.</li>
              <li><span aria-hidden="true">✓</span> Describe el beneficio principal del producto.</li>
              <li><span aria-hidden="true">✓</span> Revisa el stock antes de guardar.</li>
              <li><span aria-hidden="true">✓</span> Marca como destacado solo lo mejor.</li>
            </ul>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page-header p {
  max-width: 560px;
  margin-top: 8px;
  font-size: 0.92rem;
}

.formulario-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.8fr);
  align-items: start;
  gap: 24px;
}

.formulario {
  padding: 28px;
}

.formulario__seccion + .formulario__seccion {
  margin-top: 30px;
  padding-top: 28px;
  border-top: 1px solid var(--border);
}

.formulario__seccion-titulo {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}

.formulario__paso {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: var(--primary-soft);
  color: var(--primary-dark);
  font-size: 0.78rem;
  font-weight: 800;
}

.formulario__seccion-titulo h2 {
  font-size: 1.08rem;
}

.formulario__seccion-titulo p {
  margin-top: 2px;
  color: var(--muted);
  font-size: 0.82rem;
}

.campos {
  display: grid;
  gap: 18px;
}

.campos--dos {
  grid-template-columns: 1fr 1fr;
}

.campo--completo {
  grid-column: 1 / -1;
}

.input-prefijo {
  position: relative;
}

.input-prefijo span {
  position: absolute;
  top: 50%;
  left: 13px;
  color: var(--muted);
  font-weight: 700;
  transform: translateY(-50%);
}

.input-prefijo .input {
  padding-left: 28px;
}

.interruptor {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 45px;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 11px;
  cursor: pointer;
}

.interruptor__pista {
  position: relative;
  flex-shrink: 0;
  width: 38px;
  height: 22px;
  border-radius: 999px;
  background: #d8dbe8;
  transition: background 0.2s ease;
}

.interruptor__bolita {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.interruptor input:checked + .interruptor__pista {
  background: var(--primary);
}

.interruptor input:checked + .interruptor__pista .interruptor__bolita {
  transform: translateX(16px);
}

.interruptor input:focus-visible + .interruptor__pista {
  outline: 3px solid rgba(79, 70, 229, 0.28);
  outline-offset: 2px;
}

.interruptor strong,
.interruptor small {
  display: block;
}

.interruptor strong {
  color: var(--ink-soft);
  font-size: 0.8rem;
}

.interruptor small {
  color: var(--muted);
  font-size: 0.68rem;
}

.iconos {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.icono {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  font-size: 1.3rem;
  transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
}

.icono:hover {
  transform: translateY(-2px);
  border-color: #c9cee3;
}

.icono--activo {
  border-color: var(--primary);
  background: var(--primary-soft);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
}

.formulario__acciones {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.vista-previa {
  position: sticky;
  top: 94px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.vista-previa__etiqueta {
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.tarjeta-previa {
  overflow: hidden;
}

.tarjeta-previa__visual {
  position: relative;
  display: grid;
  place-items: center;
  height: 150px;
  background: linear-gradient(145deg, #eef2ff, #e0f7fb);
}

.tarjeta-previa__visual > .badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.85);
}

.tarjeta-previa__estrella {
  right: 12px;
  left: auto !important;
}

.tarjeta-previa__icono {
  font-size: 3.6rem;
  filter: drop-shadow(0 12px 16px rgba(17, 21, 42, 0.16));
}

.tarjeta-previa__cuerpo {
  padding: 18px;
}

.tarjeta-previa__cuerpo h2 {
  font-size: 1.05rem;
}

.tarjeta-previa__cuerpo p {
  display: -webkit-box;
  margin-top: 6px;
  overflow: hidden;
  color: var(--muted);
  font-size: 0.82rem;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.tarjeta-previa__pie {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

.consejos {
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.consejos h2 {
  font-size: 0.85rem;
  letter-spacing: 0.02em;
}

.consejos ul {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.consejos li {
  display: flex;
  gap: 7px;
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.5;
}

.consejos li span {
  color: var(--success);
  font-weight: 900;
}

@media (max-width: 980px) {
  .formulario-layout {
    grid-template-columns: 1fr;
  }

  .vista-previa {
    position: static;
    grid-row: 1;
  }

  .tarjeta-previa__visual {
    height: 130px;
  }

  .consejos {
    display: none;
  }
}

@media (max-width: 560px) {
  .formulario {
    padding: 20px;
  }

  .campos--dos {
    grid-template-columns: 1fr;
  }

  .formulario__acciones {
    flex-direction: column-reverse;
  }

  .formulario__acciones .btn {
    width: 100%;
  }
}
</style>
