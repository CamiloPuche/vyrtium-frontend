# Especificación de Arquitectura Frontend 05 · Panel de Control & CRUD de Categorías

**Fase:** Panel de Administración & Gestión de Categorías  
**Rama:** `feat/dashboard-categories`  
**Estado:** Completado  
**Revisión:** Equipo de Ingeniería Vyrtium  

---

## 1. Contexto y Necesidad Técnica

El módulo de administración de categorías permite a los usuarios autenticados crear, listar, editar y eliminar categorías comerciales que estructuran el catálogo de productos. Debe respetar la protección de rutas con JWT y la integridad referencial de la base de datos (rechazando eliminaciones de categorías con productos asociados activos).

---

## 2. Decisiones de Arquitectura (ADR)

### ADR F05.1: Layout de Administración Protegido con `ProtectedRoute`
- **Decisión:** Envolver `DashboardLayout` con `<ProtectedRoute>` para verificar la existencia del token de acceso antes de renderizar la interfaz privada.
- **Justificación:** Previene fugas visuales de datos y redirige automáticamente a usuarios no autenticados a `/login`.

### ADR F05.2: Desacoplamiento de Servicios de Categoría en `category.service.ts`
- **Decisión:** Conectar `categoryService` consumiendo `/categories` con mapeo directo de `response.data.data`.
- **Justificación:** Garantiza tipos estrictos TypeScript (`Category[]` con `productsCount`) y elimina fallos de anidación.

### ADR F05.3: Validación y Advertencia Relacional Previa al Borrado
- **Decisión:** En `DeleteConfirmModal.tsx`, mostrar una alerta si `productsCount > 0` advirtiendo que el backend rechazará la eliminación (`409 Conflict`), ofreciendo explicaciones claras al usuario.
- **Justificación:** Mejora la experiencia de usuario guiándolo sobre la causa exacta de la restricción de integridad de la base de datos.

### ADR F05.4: Búsqueda Reactiva en Memoria
- **Decisión:** Implementar filtrado con `useMemo` sobre la lista de categorías en `CategoriasPage`.
- **Justificación:** Proporciona filtrado instantáneo a medida que el usuario escribe sin generar peticiones HTTP adicionales.

---

## 3. Estructura de Archivos

```text
src/
├── app/
│   └── dashboard/
│       ├── layout.tsx              # Shell del panel con Sidebar, Header y ProtectedRoute
│       ├── page.tsx                # Vista de Resumen y KPIs comerciales
│       └── categorias/
│           └── page.tsx            # Vista principal del CRUD de Categorías
├── components/
│   └── dashboard/
│       ├── Sidebar.tsx             # Menú lateral con branding y logout
│       ├── Header.tsx              # Encabezado superior con datos del usuario
│       ├── CategoryTable.tsx       # Tabla de categorías con conteo de productos y acciones
│       ├── CategoryModal.tsx       # Modal accesible para creación y edición
│       └── DeleteConfirmModal.tsx  # Diálogo de confirmación y advertencia relacional
└── services/
    └── category.service.ts         # Capa de consumo HTTP autenticado para categorías
```

---

## 4. Criterios de Aceptación y Verificación

- El layout del dashboard restringe el acceso a invitados no autenticados.
- Las categorías sembradas se listan con su conteo real de productos (`productsCount`).
- La creación y edición actualizan la tabla inmediatamente sin recargas de página.
- El intento de eliminar una categoría con productos asociados muestra un mensaje de error claro proveniente del backend (`409 Conflict`).
- `pnpm build` compila con 0 errores de TypeScript y 0 warnings de linter.
