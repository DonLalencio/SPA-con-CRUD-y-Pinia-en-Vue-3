<script setup>
import { useToast } from '@/composables/useToast'

const { notificaciones, cerrar } = useToast()

const iconos = {
  exito: '✓',
  error: '!',
  info: 'i'
}
</script>

<template>
  <Teleport to="body">
    <div class="toasts" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="toast" tag="div" class="toasts__lista">
        <div
          v-for="notificacion in notificaciones"
          :key="notificacion.id"
          class="toast"
          :class="`toast--${notificacion.tipo}`"
          role="status"
        >
          <span class="toast__icono" aria-hidden="true">{{ iconos[notificacion.tipo] || '✓' }}</span>
          <p class="toast__mensaje">{{ notificacion.mensaje }}</p>
          <button
            type="button"
            class="toast__cerrar"
            aria-label="Cerrar notificación"
            @click="cerrar(notificacion.id)"
          >
            ×
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toasts {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 120;
  pointer-events: none;
}

.toasts__lista {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  width: min(380px, calc(100vw - 40px));
  padding: 12px 12px 12px 14px;
  border: 1px solid var(--border);
  border-radius: 13px;
  background: var(--surface);
  box-shadow: var(--shadow-lg);
  pointer-events: auto;
}

.toast__icono {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--success-soft);
  color: var(--success);
  font-size: 0.78rem;
  font-weight: 900;
}

.toast--error .toast__icono {
  background: var(--danger-soft);
  color: var(--danger);
}

.toast--info .toast__icono {
  background: var(--primary-soft);
  color: var(--primary-dark);
}

.toast__mensaje {
  flex: 1;
  font-size: 0.84rem;
  font-weight: 600;
  line-height: 1.4;
}

.toast__cerrar {
  border: 0;
  background: transparent;
  color: var(--muted);
  font-size: 1.15rem;
  line-height: 1;
  padding: 4px 6px;
  border-radius: 7px;
}

.toast__cerrar:hover {
  background: var(--surface-soft);
  color: var(--ink);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

@media (max-width: 520px) {
  .toasts {
    right: 12px;
    bottom: 12px;
    left: 12px;
  }

  .toasts__lista {
    align-items: stretch;
  }

  .toast {
    width: 100%;
  }
}
</style>
