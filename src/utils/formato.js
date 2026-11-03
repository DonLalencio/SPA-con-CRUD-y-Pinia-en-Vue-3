const formatoMoneda = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

export function formatearPrecio(valor) {
  return formatoMoneda.format(Number(valor) || 0)
}

export function formatearNumero(valor) {
  return new Intl.NumberFormat('es-EC').format(Number(valor) || 0)
}
