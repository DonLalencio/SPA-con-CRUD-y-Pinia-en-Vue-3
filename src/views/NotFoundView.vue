<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="page container">
    <div class="no-encontrada">
      <span class="no-encontrada__codigo" aria-hidden="true">404</span>
      <span class="eyebrow">Página no encontrada</span>
      <h1>Parece que este pasillo no existe.</h1>
      <p>
        La ruta <code>{{ route.fullPath }}</code> no está disponible. Vuelve al inicio o
        explora el catálogo de productos.
      </p>
      <div class="no-encontrada__acciones">
        <RouterLink to="/" class="btn btn--primary">Ir al inicio</RouterLink>
        <RouterLink to="/productos" class="btn btn--outline">Ver productos</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-encontrada {
  display: grid;
  justify-items: center;
  gap: 14px;
  padding: 80px 20px;
  text-align: center;
}

.no-encontrada__codigo {
  font-size: clamp(5rem, 16vw, 10rem);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.06em;
  background: linear-gradient(120deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.no-encontrada h1 {
  max-width: 640px;
  font-size: clamp(1.7rem, 4vw, 2.6rem);
}

.no-encontrada p {
  max-width: 540px;
  color: var(--muted);
}

.no-encontrada code {
  padding: 2px 6px;
  border-radius: 6px;
  background: var(--surface-soft);
  color: var(--ink-soft);
  font-size: 0.86em;
}

.no-encontrada__acciones {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 8px;
}
</style>
