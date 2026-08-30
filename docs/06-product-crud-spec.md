# Especificación de Arquitectura Frontend 06 · CRUD de Productos & Cloudinary

**Fase:** Panel de Administración & Gestión de Productos  
**Rama:** `feat/dashboard-products`  
**Estado:** Completado  
**Revisión:** Equipo de Ingeniería Vyrtium  

---

## 1. Contexto y Necesidad Técnica

El módulo de administración de productos permite a los usuarios autorizados crear, listar, editar y eliminar ítems del catálogo comercial. Debe soportar la subida binaria de imágenes a Cloudinary (`multipart/form-data`), selección de categorías dinámicas, precios en Pesos Colombianos (COP), control de inventario/stock, filtros combinados y paginación.

---

## 2. Decisiones de Arquitectura (ADR)

### ADR F06.1: Subida de Imágenes Híbrida vía `multipart/form-data`
- **Decisión:** En `ProductModal.tsx`, si el usuario selecciona un archivo binario mediante el dropzone, se construye un `FormData` adjuntando el archivo en la clave `image`. Si no se reemplaza la imagen durante la edición, se envían los datos como JSON o FormData sin el campo `image`.
- **Justificación:** Se alinea de forma transparente con el middleware `upload.single('image')` y el servicio de Cloudinary en el backend.

### ADR F06.2: Prevención de Cambio Accidental de Valores Numéricos (Wheel Scroll)
- **Decisión:** Todos los `<input type="number">` (precio y stock) incluyen `onWheel={(e) => (e.target as HTMLElement).blur()}` y reglas de estilo para ocultar las flechas de incremento predeterminadas del navegador.
- **Justificación:** Previene alteraciones involuntarias de precios y existencias al hacer scroll sobre la vista.

### ADR F06.3: Previsualización Local Inmediata (Blob Preview)
- **Decisión:** Al seleccionar una imagen en el dropzone, se genera un `URL.createObjectURL(file)` para previsualización inmediata en el cliente antes de enviar la petición de subida al servidor.
- **Justificación:** Ofrece retroalimentación visual instantánea y permite al usuario confirmar o descartar la imagen antes de someter el formulario.

### ADR F06.4: Búsqueda Debounced & Paginación Sincronizada
- **Decisión:** El buscador de texto aplica un debounce de 300ms y resetea la página actual a 1 cada vez que se modifican los criterios de búsqueda, categoría u ordenamiento.
- **Justificación:** Optimiza el tráfico de red y evita condiciones de carrera o índices de página fuera de rango.

---

## 3. Estructura de Archivos

```text
src/
├── app/
│   └── dashboard/
│       └── productos/
│           └── page.tsx            # Vista principal del CRUD de Productos con filtros
├── components/
│   └── dashboard/
│       ├── ProductTable.tsx        # Tabla con miniaturas de Cloudinary, COP, stock y acciones
│       ├── ProductModal.tsx        # Modal con dropzone Cloudinary y validaciones
│       ├── ProductDetailModal.tsx  # Modal para visualizacion detallada del producto (GET /products/:id)
│       └── DeleteProductModal.tsx  # Diálogo de confirmación para borrado suave
└── services/
    └── product.service.ts          # Capa de consumo HTTP autenticado para productos
```

---

## 4. Criterios de Aceptación y Verificación

- La tabla lista los productos paginados con miniaturas de Cloudinary y precios en COP (`formatCOP`).
- La creación de un producto con imagen sube el archivo a Cloudinary y refleja la miniatura inmediatamente.
- La edición permite modificar campos comerciales y reemplazar opcionalmente la imagen.
- Los inputs numéricos de precio y stock no permiten alteraciones por scroll de ratón.
- La eliminación lógica (`deleted_at`) retira el producto del panel y de la tienda pública.
- `pnpm build` compila con 0 errores de TypeScript y 0 warnings de linter.
