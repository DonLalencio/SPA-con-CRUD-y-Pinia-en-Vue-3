<script setup>
import { onUnmounted, watch } from 'vue'

const props = defineProps({
  abierto: { type: Boolean, default: false },
  titulo: { type: String, default: '¿Confirmar acción?' },
  mensaje: { type: String, default: '' },
  etiquetaConfirmar: { type: String, default: 'Confirmar' },
  etiquetaCancelar: { type: String, default: 'Cancelar' },
  peligro: { type: Boolean, default: true }
})

const emit = defineEmits(['confirmar', 'cerrar'])

watch(
  () => props.abierto,
  (abierto) => {
    document.body.style.overflow = abierto ? 'hidden' : ''
  }
)

onUnmounted(() => {
  document.body.style.overflow = ''
})

function confirmar() {
  emit('confirmar')
  emit('cerrar')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="abierto" class="modal" role="presentation" @click.self="$emit('cerrar')">
        <div
          class="modal__panel"
          role="dialog"
          aria-modal="true"
          :aria-label="titulo"
          @keydown.esc="$emit('cerrar')"
        >
          <div class="modal__icono" :class="{ 'modal__icono--peligro': peligro }" aria-hidden="true">
            {{ peligro ? '🗑️' : '✓' }}
          </div>
          <h2 class="modal__titulo">{{ titulo }}</h2>
          <p v-if="mensaje" class="modal__mensaje">{{ mensaje }}</p>
          <div class="modal__acciones">
            <button type="button" class="btn btn--outline" @click="$emit('cerrar')">
              {{ etiquetaCancelar }}
            </button>
            <button
              type="button"
              class="btn"
              :class="peligro ? 'btn--danger' : 'btn--primary'"
              @click="confirmar"
            >
              {{ etiquetaConfirmar }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(16, 20, 40, 0.48);
  backdrop-filter: blur(4px);
}

.modal__panel {
  width: min(420px, 100%);
  padding: 28px;
  border-radius: 22px;
  background: var(--surface);
  box-shadow: var(--shadow-lg);
  text-align: center;
}

.modal__icono {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  margin: 0 auto 16px;
  border-radius: 18px;
  background: var(--primary-soft);
  font-size: 1.6rem;
}

.modal__icono--peligro {
  background: var(--danger-soft);
}

.modal__titulo {
  font-size: 1.25rem;
}

.modal__mensaje {
  margin-top: 8px;
  color: var(--muted);
  font-size: 0.9rem;
}

.modal__acciones {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.modal__acciones .btn {
  flex: 1;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal__panel,
.modal-leave-active .modal__panel {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal__panel,
.modal-leave-to .modal__panel {
  transform: translateY(12px) scale(0.97);
}
</style>
