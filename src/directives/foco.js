/**
 * Directiva personalizada v-foco.
 * Coloca el cursor en el campo cuando el elemento se monta en el DOM.
 * Se usa en el buscador de productos y en el primer campo del formulario.
 */
export const vFoco = {
  mounted(el) {
    requestAnimationFrame(() => el.focus({ preventScroll: true }))
  }
}
