# Especificación de Arquitectura Frontend 03 · Tienda Online & Catálogo Público

**Fase:** Tienda Comercial Pública, Catálogo y Carrito Interactivo  
**Rama:** `feat/public-landing`  
**Estado:** Completado  
**Revisión:** Equipo de Ingeniería Vyrtium  

---

## 1. Contexto y Necesidad Técnica

El catálogo público constituye la experiencia de compra y vitrina comercial de la plataforma para clientes y evaluadores. Debe consumir el endpoint anónimo optimizado `GET /api/publico/productos` sin requerir credenciales ni tokens de autorización, permitiendo búsquedas en tiempo real, filtrado por categorías, ordenamiento por precio o fecha, paginación fluida y gestión de un carrito de compras interactivo con persistencia local.

---

## 2. Decisiones de Arquitectura (ADR)

### ADR F03.1: Desacoplamiento del Endpoint Público en `product.service.ts`
- **Decisión:** Implementar `productService.getPublicProducts(params)` que invoca `/publico/productos` mapeando la estructura paginada `{ items: data, meta }`.
- **Justificación:** Centraliza la lógica de parámetros de consulta (`page`, `limit`, `search`, `categoryId`, `sortBy`, `sortOrder`) y aísla los componentes visuales de la capa HTTP.

### ADR F03.2: Descubrimiento Dinámico de Categorías Públicas
- **Decisión:** Extraer las categorías activas directamente desde los productos retornados por el catálogo público (`GET /api/publico/productos`) sin consultar el endpoint privado `/api/categories`.
- **Justificación:** Mantiene `/api/categories` estrictamente protegido bajo JWT para el panel administrativo y evita errores `401 Unauthorized` a usuarios anónimos en la tienda.

### ADR F03.3: Carrito de Compras Global (`CartContext` & `CartDrawer`)
- **Decisión:** Crear un contexto `CartContext` con persistencia en `localStorage` y un panel lateral deslizable (`CartDrawer`).
- **Justificación:** Proporciona una experiencia de compra retail realista con control de límites de stock, cálculo de subtotal en COP, ajuste de cantidades y vaciado de carrito.

### ADR F03.4: Ciclo de Vida Limpio en Búsqueda y Paginación (Debounce 300ms)
- **Decisión:** El hook de debouncing actualiza `debouncedSearch` de forma desacoplada, mientras que `loadProducts` administra internamente el estado de carga (`isLoadingProducts`) en su bloque `finally`.
- **Justificación:** Previene condiciones de carrera o bloqueos del skeleton loader al navegar entre páginas.

### ADR F03.5: Formateo Monetario en Moneda Local (COP) y Maquetación Limpia
- **Decisión:** Usar `formatCOP(price)` (ej. `$ 249.900`) y ubicar la categoría y el indicador de stock debajo de la descripción del producto, manteniendo la imagen limpia e impecable.
- **Justificación:** Cumple con la especificación de moneda local establecida en el backend y optimiza la jerarquía visual de la tarjeta de producto.

---

## 3. Estructura de Componentes Implementados

```text
src/
├── app/
│   ├── layout.tsx                  # RootLayout con AuthProvider, CartProvider, CartDrawer y Toaster
│   ├── page.tsx                    # Landing Hub principal con accesos y autoría
│   └── catalogo/
│       └── page.tsx                # Vista de Tienda Comercial Online
├── components/
│   └── landing/
│       ├── Navbar.tsx              # Barra superior de tienda con contador de carrito e input de búsqueda
│       ├── CartDrawer.tsx          # Panel deslizable lateral para gestión de pedidos y checkout simulado
│       ├── CategoryFilter.tsx      # Pastillas horizontales para filtro dinámico por categoría
│       ├── ProductCard.tsx         # Tarjeta retail con stock, categoría, precio COP y botón Comprar
│       ├── ProductGrid.tsx         # Cuadrícula responsiva con Skeletons y Empty State
│       └── Pagination.tsx          # Paginador con botones numéricos y navegación
├── context/
│   ├── AuthContext.tsx             # Contexto de autenticación de administradores
│   └── CartContext.tsx             # Contexto de carrito de compras con persistencia
└── services/
    ├── product.service.ts          # Métodos getPublicProducts, getProducts, create, update, delete
    └── category.service.ts         # Métodos getCategories, create, update, delete
```

---

## 4. Criterios de Aceptación y Verificación

- `GET /api/publico/productos` se consume sin token y responde con código 200.
- La navegación entre Inicio (`/`) y Catálogo (`/catalogo`) carga los productos inmediatamente sin bloqueo de skeletons.
- El filtro "Todos" y las categorías individuales filtran los productos con precisión.
- El botón "Comprar" agrega productos al carrito, incrementa el badge numérico y respeta el stock disponible.
- El drawer del carrito permite modificar cantidades, eliminar ítems y calcular el total en COP.
- `pnpm build` compila con 0 errores de TypeScript y 0 warnings de linter.
