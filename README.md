# 🛍️ Vyrtium Frontend · E-Commerce & Administración Comercial

Frontend moderno, reactivo y de alto rendimiento para la plataforma de comercio electrónico y consola de administración **Vyrtium**, desarrollado con **Next.js 16 (App Router)**, **React 19**, **TypeScript** y **Tailwind CSS**.

---

## 🌟 Características Principales

### 🏪 1. Catálogo Comercial Público (`/catalogo`)
- **Experiencia de Tienda Online:** Catálogo comercial con diseño retail moderno, tarjetas de producto con badges de categoría e indicador de disponibilidad en inventario.
- **Precios en Pesos Colombianos:** Formateo localizado de moneda (`formatCOP`).
- **Carrito de Compras Deslizante (Slide-over Drawer):** Carrito interactivo con control de cantidades `+`/`-`, límites de stock, cálculo reactivo de subtotales y persistencia en `localStorage`.
- **Filtros Dinámicos:** Píldoras de filtrado por categoría descubiertas automáticamente y búsqueda por texto con *debouncing* (300ms).
- **Paginación Sincronizada:** Navegación por páginas de resultados optimizada.

### 🔐 2. Autenticación & Control de Sesión (`/login` & `/registro`)
- **Tarjeta Deslizante Unificada (Morphing Slider):** Vista única con transición visual fluida entre formularios de inicio de sesión y registro de usuario.
- **Rotación de Tokens JWT:** Gestión de `accessToken` en memoria/storage y renovación automática con `refreshToken` vía interceptor de Axios.
- **Rutas Protegidas (`<ProtectedRoute>`):** Verificación de sesión en cliente y servidor; redirección automática para usuarios sin credenciales activas.

### 🏷️ 3. Panel de Administración · Gestión de Categorías (`/dashboard/categorias`)
- **Tabla Comercial con Métricas:** Listado con badge dinámico del conteo de productos asociados (`productsCount`).
- **Buscador en Memoria:** Filtrado instantáneo por nombre en tiempo real.
- **Modales Accesibles:** Creación y edición con validación y prevención de doble clic.
- **Borrado Seguro:** Confirmación amigable con bloqueo preventivo y manejo del error relacional (`409 Conflict`) si la categoría posee productos activos.

### 📦 4. Gestión de Productos & Cloudinary (`/dashboard/productos`)
- **Subida de Imágenes a Cloudinary:** Dropzone interactivo para arrastrar y soltar archivos (`multipart/form-data`) con previsualización instantánea antes de enviar al servidor.
- **Formulario Completo:** Asignación de categorías, precios en COP, descripción comercial y control de stock.
- **Prevención de Scroll Accidental:** Bloqueo del evento `wheel` en inputs numéricos para evitar modificaciones involuntarias de precios y existencias.
- **Filtros Combinados:** Búsqueda por texto, selector de categoría, ordenamiento múltiple (*precio, stock, fecha, nombre*) y paginación.

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión / Propósito |
| :--- | :--- |
| **Next.js** | `16.3.3` (App Router, Turbopack, SSR/CSR híbrido) |
| **React** | `19.0.0` (React Compiler, Hooks modernos) |
| **TypeScript** | `5.x` (Tipado estricto, 0 `any`) |
| **Tailwind CSS** | `4.x` (Diseño responsivo y utilidades modernas) |
| **Axios** | Cliente HTTP con interceptores para JWT refresh token |
| **Sonner** | Notificaciones Toast elegantes y no bloqueantes |
| **Lucide React** | Iconografía vectorial consistente y accesible |

---

## 📐 Decisiones de Arquitectura (ADRs)

La arquitectura del frontend sigue los principios de **Container-Presentational Pattern**, **Capa de Servicios Desacoplada** y **Strict Type Safety**, con especificaciones detalladas para cada fase:

- [01 · Scaffolding & Configuración Base (Next.js 16 + Tailwind)](docs/01-frontend-scaffolding-spec.md)
- [02 · Cliente de Autenticación & Manejo Seguro de Tokens JWT](docs/02-auth-client-spec.md)
- [03 · Landing Page Comercial, Carrito & Catálogo Público](docs/03-public-landing-spec.md)
- [04 · Tarjeta Deslizante Unificada de Login y Registro](docs/04-auth-views-spec.md)
- [05 · Panel de Control & CRUD de Categorías con Conteo Relacional](docs/05-category-crud-spec.md)
- [06 · Gestión de Productos, Dropzone Cloudinary & Precios COP](docs/06-product-crud-spec.md)

---

## 📁 Estructura del Proyecto

```text
vyrtium-frontend/
├── docs/                               # Especificaciones arquitectónicas y ADRs
│   ├── 01-frontend-scaffolding-spec.md
│   ├── 02-auth-client-spec.md
│   ├── 03-public-landing-spec.md
│   ├── 04-auth-views-spec.md
│   ├── 05-category-crud-spec.md
│   └── 06-product-crud-spec.md
├── public/                             # Assets estáticos
├── src/
│   ├── app/                            # Rutas de Next.js (App Router)
│   │   ├── layout.tsx                  # Root layout con AuthProvider, CartProvider y Toaster
│   │   ├── page.tsx                    # Landing / Home principal
│   │   ├── catalogo/
│   │   │   └── page.tsx                # Catálogo público de la tienda
│   │   ├── login/
│   │   │   └── page.tsx                # Vista de inicio de sesión
│   │   ├── registro/
│   │   │   └── page.tsx                # Vista de registro de usuario
│   │   └── dashboard/
│   │       ├── layout.tsx              # Shell administrativo protegido (Sidebar + Header)
│   │       ├── page.tsx                # Resumen y métricas comerciales (KPIs)
│   │       ├── categorias/
│   │       │   └── page.tsx            # CRUD de Categorías
│   │       └── productos/
│   │           └── page.tsx            # CRUD de Productos
│   ├── components/
│   │   ├── auth/                       # Componentes de autenticación (Slider, ProtectedRoute)
│   │   ├── landing/                    # Navbar, ProductCard, ProductGrid, CartDrawer, Pagination
│   │   └── dashboard/                  # Sidebar, Header, CategoryTable, ProductTable, Modales
│   ├── context/
│   │   ├── AuthContext.tsx             # Estado global de sesión y perfil de usuario
│   │   └── CartContext.tsx             # Estado global del carrito y persistencia
│   ├── lib/
│   │   └── utils.ts                    # Formateo de COP, extractor de errores de API y utilidades
│   ├── services/
│   │   ├── api.ts                      # Instancia base de Axios con interceptores
│   │   ├── auth.service.ts             # Endpoints de autenticación (/auth)
│   │   ├── category.service.ts         # Endpoints privados de categorías (/categories)
│   │   └── product.service.ts          # Endpoints de catálogo (/publico/productos & /products)
│   └── types/                          # Interfaces TypeScript de dominio y DTOs
├── next.config.ts                      # Configuración de Next.js y dominios de imágenes remotas
├── package.json                        # Dependencias y scripts
└── tsconfig.json                       # Configuración de compilación TypeScript
```

---

## ⚙️ Variables de Entorno

Crea un archivo `.env.local` en la raíz de `vyrtium-frontend`:

```env
# URL base de la API REST del backend
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

> **Nota para producción:** Al desplegar en Vercel, configura `NEXT_PUBLIC_API_URL` apuntando a tu instancia en Render (ej. `https://vyrtium-backend.onrender.com/api`).

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos
- **Node.js** >= 18.x
- **pnpm** (recomendado) o npm / yarn

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Iniciar servidor de desarrollo
```bash
pnpm dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 3. Compilar para producción
```bash
pnpm build
pnpm start
```

---

## 📐 Patrones y Buenas Prácticas de Ingeniería

1. **Arquitectura Container-Presentational:** Separación clara entre componentes de vista, hooks y lógica de negocio.
2. **Capa de Servicios Desacoplada:** Todo el consumo HTTP reside en `src/services/`, aislando a la UI de detalles de transporte o contratos de red.
3. **Manejo Centralizado de Errores:** Función utilitaria `getApiErrorMessage(error)` que extrae mensajes limpios del backend y evita tecnicismos en las alertas al usuario.
4. **Optimización de Renderizado:** Memorización con `useMemo` y `useCallback`, debouncing en búsquedas y renderizado de imágenes optimizadas con `next/image`.
5. **Accesibilidad y UX:** Notificaciones visuales Sonner no intrusivas, modales accesibles con backdrop blur y prevención de desbordamiento en scroll.

---

## 📄 Licencia

Desarrollado con altos estándares de arquitectura por **Camilo Puche**.
