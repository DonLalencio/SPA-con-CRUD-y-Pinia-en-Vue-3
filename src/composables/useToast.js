import { ref } from 'vue'

const notificaciones = ref([])
let contador = 0

function cerrar(id) {
  notificaciones.value = notificaciones.value.filter((n) => n.id !== id)
}

export function useToast() {
  function notificar(mensaje, tipo = 'exito') {
    const id = ++contador
    notificaciones.value.push({ id, mensaje, tipo })
    setTimeout(() => cerrar(id), 3200)
  }

  return { notificaciones, notificar, cerrar }
}
