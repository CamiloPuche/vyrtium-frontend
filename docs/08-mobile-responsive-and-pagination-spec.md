# Especificación de Arquitectura 08 · Rediseño Responsive Mobile-First y Paginación de Catálogo

**Fase:** Optimización UX / UI Mobile & Catálogo
**Rama:** `feat/mobile-responsive-and-catalog-pagination`
**Estado:** Completado
**Módulos Afectados:**
- [03-public-landing-spec.md](03-public-landing-spec.md) (Catálogo, Navbar y Carrito)
- [04-auth-views-spec.md](04-auth-views-spec.md) (Tarjeta de Autenticación)
- [05-category-crud-spec.md](05-category-crud-spec.md) (Tabla de Categorías)
- [06-product-crud-spec.md](06-product-crud-spec.md) (Tabla de Productos y Modales)

---

## 1. Contexto y Necesidad Técnica

Durante las pruebas de usuario en dispositivos móviles reales (smartphones con anchos de 320px a 430px), se detectaron fricciones de usabilidad:
1. Las tablas del panel administrativo requerían desplazamiento horizontal forzado para interactuar con botones de acción.
2. El contenedor de autenticación deslizante coexistía en el DOM ocupando espacio innecesario en pantallas verticales.
3. El buscador del navbar comprimía los logos y accesos en resoluciones angostas.
4. El catálogo público paginaba de 8 en 8 en lugar de múltiplos óptimos para grillas responsivas.

---

## 2. Decisiones de Arquitectura (ADR)

### ADR F08.1: Patrón Dual Table / Card List para Dashboard
- **Decisión:** Implementar renderizado condicional en `ProductTable.tsx` y `CategoryTable.tsx`:
  - **Desktop (`hidden md:block`):** Vista tabular tradicional con todas las columnas comerciales.
  - **Móvil (`block md:hidden`):** Tarjetas táctiles individuales con miniatura, categoría, precio en COP, stock y barra inferior de acciones rápidas (`Detalle`, `Editar`, `Eliminar`).
- **Justificación:** Elimina la necesidad de scroll horizontal en smartphones y maximiza la ergonomía táctil (Thumb Zone).

### ADR F08.2: Aislamiento Condicional en Autenticación Móvil
- **Decisión:** En `AuthSliderCard.tsx`, renderizar exclusivamente el formulario activo en resoluciones móviles (`hidden md:flex` en el inactivo) mientras se preserva la animación de deslizamiento completa en pantallas desktop.
- **Justificación:** Evita desbordamientos y elimina espacios en blanco en pantallas móviles.

### ADR F08.3: Paginación Comercial en Base 12 (`limit: 12`)
- **Decisión:** Ajustar el límite de consulta pública en `catalogo/page.tsx` a `limit: 12`.
- **Justificación:** El número 12 es divisible de forma exacta entre 1 (móvil), 2 (tablets), 3 (laptops) y 4 (pantallas de escritorio), evitando filas incompletas o huérfanas en cualquier resolución.

### ADR F08.4: Modales con Viewport Dinámico (`max-h-[90dvh]`)
- **Decisión:** Todos los modales del dashboard (`ProductModal`, `CategoryModal`, `ProductDetailModal`, `DeleteConfirmModal`, `DeleteProductModal`) utilizan `max-h-[90dvh]` y scroll interno con paddings adaptables (`p-5 sm:p-8`).
- **Justificación:** Garantiza que los formularios y botones de confirmación permanezcan siempre accesibles cuando se despliegan teclados virtuales en dispositivos móviles.

---

## 3. Criterios de Aceptación y Verificación

- La tienda pública muestra hasta 12 productos por página sin saltos abruptos.
- La barra de navegación se adapta sin desbordamiento horizontal en pantallas desde 320px.
- El panel de productos y categorías en móvil muestra tarjetas completas con acciones táctiles directas.
- El login y registro en móvil permiten alternar entre modos fluidamente.
