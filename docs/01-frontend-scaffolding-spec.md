# Especificación de Arquitectura Frontend 01 · Scaffolding & Setup Base

**Fase:** Scaffolding Inicial y Setup Base del Frontend
**Rama:** `chore/initial-scaffolding`
**Estado:** Completado
**Revisión:** Equipo de Ingeniería Vyrtium

---

## 1. Contexto y Necesidad Técnica

Para construir la interfaz de usuario moderna requerida en la prueba técnica (Landing Page pública con catálogo y Panel privado para administración de categorías y productos), se inicializó la arquitectura del cliente frontend utilizando **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4** y **TypeScript estricto**.

---

## 2. Decisiones de Arquitectura (ADR)

### ADR F01.1: Next.js App Router con Estructura `src/`
- **Decisión:** Emplear App Router dentro del directorio `src/` con alias de importación `@/*`.
- **Justificación:** Optimiza el renderizado del lado del servidor (SSR) para SEO en la Landing pública y provee layouts anidados y componentes de cliente (`'use client'`) para el panel privado.

### ADR F01.2: Stack de Estilos y Utilidades UI
- **Decisión:** Integrar Tailwind CSS v4, `clsx`, `tailwind-merge` (mediante `cn()`) y tipografía `Inter` de Google Fonts.
- **Justificación:** Garantiza un sistema de diseño consistente, alta velocidad de desarrollo, tipografía moderna y prevención de conflictos de clases CSS.

### ADR F01.3: Sistema de Notificaciones Toast con Sonner
- **Decisión:** Integrar `sonner` (`<Toaster richColors position="top-right" />`) a nivel de `RootLayout`.
- **Justificación:** Provee feedback visual no intrusivo y accesible para eventos de autenticación, creación, actualización y errores de API.

### ADR F01.4: Utilidad de Formateo de Moneda (`formatCOP`)
- **Decisión:** Proveer el helper `formatCOP` en `src/lib/utils.ts` usando la API nativa de JavaScript `Intl.NumberFormat('es-CO')`.
- **Justificación:** Garantiza que todos los precios en la landing y el dashboard se visualicen de forma estandarizada en Pesos Colombianos (COP) sin decimales innecesarios.

---

## 3. Estructura de Directorios Inicial

```text
vyrtium-frontend/
├── docs/
│   └── 01-frontend-scaffolding-spec.md
├── public/
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css         # Estilos globales y tokens Tailwind
│   │   ├── layout.tsx          # RootLayout con Inter Font y Toaster Sonner
│   │   └── page.tsx            # Página inicial
│   └── lib/
│       └── utils.ts            # Helpers de UI (cn, formatCOP)
├── .env.example                # Plantilla de variables de entorno
├── .env.local                  # Configuración local de NEXT_PUBLIC_API_URL
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## 4. Criterios de Aceptación y Verificación

- El proyecto compila limpiamente con TypeScript estricto.
- Variables de entorno cargadas correctamente en `.env.local`.
- `sonner` disponible globalmente a través del `RootLayout`.
- Helper `formatCOP(150000)` retorna `"$ 150.000"`.
