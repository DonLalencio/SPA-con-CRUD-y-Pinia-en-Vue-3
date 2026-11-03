<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'

const carrito = useCartStore()
const { totalUnidades } = storeToRefs(carrito)
</script>

<template>
  <header class="nav">
    <div class="container nav__inner">
      <RouterLink to="/" class="marca" aria-label="Nova Store, ir al inicio">
        <span class="marca__logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 8h12l-1.2 11H7.2L6 8Z" stroke-linejoin="round" />
            <path d="M9 8a3 3 0 0 1 6 0" stroke-linecap="round" />
          </svg>
        </span>
        <span class="marca__texto">Nova<strong>Store</strong></span>
      </RouterLink>

      <nav class="nav__links" aria-label="Navegación principal">
        <RouterLink to="/" class="nav__link">Inicio</RouterLink>
        <RouterLink to="/productos" class="nav__link">Productos</RouterLink>
        <RouterLink to="/carrito" class="nav__link nav__link--carrito">
          <span aria-hidden="true">🛒</span>
          <span>Carrito</span>
          <span v-if="totalUnidades > 0" class="nav__badge">{{ totalUnidades }}</span>
        </RouterLink>
      </nav>

      <div class="nav__actions">
        <RouterLink to="/productos/crear" class="btn btn--primary btn--sm">
          <span aria-hidden="true">＋</span>
          <span class="nav__cta-texto">Nuevo producto</span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgba(228, 231, 241, 0.8);
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
}

.nav__inner {
  display: flex;
  align-items: center;
  gap: 28px;
  min-height: 70px;
}

.marca {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  font-size: 1.08rem;
  letter-spacing: -0.03em;
}

.marca__logo {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: linear-gradient(135deg, var(--primary) 0%, #7c6cf6 55%, var(--accent) 130%);
  color: #fff;
  box-shadow: 0 8px 18px -8px rgba(79, 70, 229, 0.75);
}

.marca__texto {
  font-weight: 500;
  color: var(--ink-soft);
}

.marca__texto strong {
  font-weight: 800;
  color: var(--ink);
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: auto;
}

.nav__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 13px;
  border-radius: 10px;
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.18s ease, background 0.18s ease;
}

.nav__link:hover {
  background: var(--surface-soft);
  color: var(--ink);
}

.nav__link.router-link-exact-active,
.nav__link.router-link-active {
  background: var(--primary-soft);
  color: var(--primary-dark);
  font-weight: 700;
}

.nav__badge {
  display: grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--primary);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
  line-height: 1;
}

.nav__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 780px) {
  .nav__inner {
    flex-wrap: wrap;
    gap: 10px 16px;
    padding: 12px 0;
  }

  .nav__links {
    order: 3;
    width: 100%;
    margin-right: 0;
    overflow-x: auto;
  }

  .nav__actions {
    margin-left: auto;
  }

  .nav__cta-texto {
    display: none;
  }

  .nav__actions .btn {
    width: 40px;
    padding: 0;
    font-size: 1.1rem;
  }
}
</style>
