# Vyrtium Frontend — Reglas y Guías de Arquitectura

Este documento establece los principios de arquitectura, estándares de diseño, buenas prácticas de código y flujo de trabajo para desarrolladores y agentes de IA en `vyrtium-frontend`.

---

## 1. Filosofía de Arquitectura: Patrón Container / Presentational & Modularidad

Organizamos el código separando la lógica de estado y llamadas API de los componentes puramente visuales:

```text
src/
├── app/                  # Rutas y layouts de Next.js (App Router)
│   ├── (auth)/           # Rutas públicas de autenticación (/login, /registro)
│   ├── (dashboard)/      # Rutas privadas protegidas (/dashboard, /dashboard/categorias, /dashboard/productos)
│   ├── layout.tsx        # RootLayout con Providers y Toaster
│   └── page.tsx          # Landing Page pública
├── components/
│   ├── ui/               # Componentes presentacionales genéricos (Button, Input, Modal, Badge, Table, Dropzone)
│   ├── landing/          # Componentes visuales de la Landing Page (Hero, ProductGrid, Filters, Navbar, Footer)
│   ├── auth/             # Formularios y componentes de autenticación
│   └── dashboard/        # Componentes del panel administrativo (Sidebar, Header, CategoryTable, ProductFormModal)
├── context/              # Contextos globales de React (AuthContext, etc.)
├── hooks/                # Custom React Hooks reutilizables
├── lib/                  # Utilidades y configuración de librerías (utils.ts con cn y formatCOP)
├── services/             # Clientes de API desacoplados y llamadas HTTP (api.ts, auth.service.ts, product.service.ts, category.service.ts)
└── types/                # Interfaces y tipos de TypeScript globales
```

### Reglas Inviolables de Componentes
1. **Componentes Presentacionales Puros (`components/ui`)**: Deben ser agnósticos del dominio, reutilizables, recibir datos y callbacks vía `props` y no realizar peticiones HTTP directamente.
2. **Capa de Servicios Desacoplada (`services/`)**: Las llamadas a la API REST residen en archivos dedicados. Prohibido ejecutar `fetch` o `axios` crudo directamente dentro de componentes visuales.
3. **Manejo Centralizado de Tokens**: La renovación transparente del Access Token (Auto-Refresh silencioso ante errores 401) se gestiona exclusivamente en el interceptor de Axios (`services/api.ts`).
4. **Protección de Rutas Privadas**: Las vistas del dashboard validan el estado de sesión de `AuthContext` y redirigen automáticamente al `/login` si el usuario no está autenticado.

---

## 2. Estándares Visuales y de Diseño (UI/UX)

1. **Estética SaaS Premium**:
   - Paletas de color armónicas y profesionales (Slate/Indigo/Emerald) evitando estilos genéricos o sobrecargados.
   - Micro-interacciones sutiles en botones, tarjetas y enlaces (`hover:scale-[1.02]`, transiciones de opacidad y sombras).
   - Formateo estricto de precios en Pesos Colombianos con `formatCOP(amount)` (ej. `$ 249.900`).
2. **Feedback Visual Inmediato**:
   - Estados de carga (*Loading Spinners*, botones deshabilitados con spinner, skeletons en tablas y catálogos).
   - Notificaciones toast claras y contextuales con `sonner` para éxitos, advertencias y errores.
   - Mensajes de error amigables bajo los inputs en validaciones de formulario.
3. **Diseño 100% Responsivo**: Todas las vistas deben adaptarse de forma fluida a pantallas móviles, tablets y monitores de escritorio.

---

## 3. Estándares de TypeScript y Calidad de Código

- **Cero `any`**: `noImplicitAny: true`. Tipar siempre parámetros, retornos de funciones, estados de React (`useState<T>`) y respuestas de API.
- **Segregación de Tipos**: Las interfaces de modelos (`Product`, `Category`, `User`, `PaginatedResponse<T>`) deben residir en `src/types/`.
- **Next.js Directivas Claras**: Usar `'use client'` explícitamente solo en componentes interactivos que requieran hooks (`useState`, `useEffect`, eventos del DOM).

---

## 4. Disciplina de Git y Convenciones

1. **Estructura de Ramas**:
   - `main`: Código listo para producción (despliegue en Vercel).
   - `develop`: Rama de integración continua.
   - `feat/<nombre>`, `fix/<nombre>`, `chore/<nombre>`, `docs/<nombre>`: Ramas de trabajo atómicas.
2. **Conventional Commits**:
   - Formato: `<tipo>(<alcance>): <descripción concisa>`
   - Ejemplos: `feat(landing): implementar catalogo de productos con filtros y buscador`, `chore(auth): configurar axios interceptors con auto refresh`.
   - Sin atribución de IA en los mensajes de commit.
3. **Criterio de Aceptación (Definition of Done)**:
   - Compilación limpia con `pnpm build` (cero errores de TypeScript o linters).
   - Especificación de arquitectura y ADRs documentados en `docs/`.

---

## 5. Variables de Entorno y Seguridad

- Las URLs de endpoints se leen siempre de `process.env.NEXT_PUBLIC_API_URL`.
- Nunca almacenar contraseñas en texto plano ni tokens en lugares expuestos sin control.
- Limpiar credenciales y estado en memoria al invocar `logout()`.
