<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__marca">
        <RouterLink to="/" class="footer__logo">
          <span class="footer__logo-icono" aria-hidden="true">N</span>
          Nova<strong>Store</strong>
        </RouterLink>
        <p>Productos que acompañan tu día a día. Proyecto SPA académico construido con Vue 3.</p>
      </div>

      <nav class="footer__nav" aria-label="Enlaces del pie de página">
        <h2 class="footer__titulo">Navegación</h2>
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink to="/productos">Productos</RouterLink>
        <RouterLink to="/productos/crear">Crear producto</RouterLink>
        <RouterLink to="/carrito">Carrito</RouterLink>
      </nav>

      <div class="footer__tecnologias">
        <h2 class="footer__titulo">Construido con</h2>
        <div class="footer__chips">
          <span class="footer__chip">Vue 3</span>
          <span class="footer__chip">Vue Router</span>
          <span class="footer__chip">Pinia</span>
          <span class="footer__chip">Vite</span>
        </div>
        <p class="footer__nota">CRUD completo · Carrito · Persistencia local</p>
      </div>
    </div>

    <div class="container footer__base">
      <p>© {{ new Date().getFullYear() }} Nova Store · Proyecto académico</p>
      <p>Hecho con 💜 para demostrar una SPA en Vue 3</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  padding-top: 48px;
  background: #11152a;
  color: #c6cbe0;
}

.footer__inner {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 40px;
}

.footer__marca {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 340px;
}

.footer__logo {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #fff;
  font-size: 1.05rem;
}

.footer__logo strong {
  font-weight: 800;
}

.footer__logo-icono {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #22d3ee);
  font-size: 0.9rem;
  font-weight: 800;
}

.footer__marca p {
  font-size: 0.84rem;
  line-height: 1.7;
  color: #8d94b0;
}

.footer__nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.86rem;
}

.footer__nav a {
  width: fit-content;
  color: #aab0c8;
  transition: color 0.18s ease;
}

.footer__nav a:hover {
  color: #fff;
}

.footer__titulo {
  margin-bottom: 4px;
  color: #fff;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.footer__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.footer__chip {
  padding: 5px 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 600;
}

.footer__nota {
  margin-top: 10px;
  color: #8d94b0;
  font-size: 0.78rem;
}

.footer__base {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 0 26px;
  border-top: 1px solid rgba(255, 255, 255, 0.09);
  color: #7f86a3;
  font-size: 0.76rem;
}

@media (max-width: 760px) {
  .footer__inner {
    grid-template-columns: 1fr 1fr;
  }

  .footer__marca {
    grid-column: 1 / -1;
  }

  .footer__base {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
