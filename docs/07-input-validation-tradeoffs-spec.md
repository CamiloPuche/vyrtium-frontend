# Especificación de Arquitectura 07 · Trade-offs de Validación de Entradas y Límites Numéricos

**Fase:** Hardening & Validación de Formularios
**Rama:** `fix/product-input-bounds`
**Estado:** Completado
**Módulos Afectados:**
- [06-product-crud-spec.md](06-product-crud-spec.md) (Modal de Creación y Edición de Productos)

---

## 1. Contexto y Trade-offs Identificados

Para prevenir desbordamiento de enteros en la base de datos y evitar el envío innecesario de payloads que fallen en el servidor, se requirió restringir los campos numéricos de precio e inventario en la interfaz de usuario con validaciones preventivas en el cliente.

---

## 2. Decisiones de Arquitectura (ADR)

### ADR F07.1: Validación de Límites Superiores en Precio y Stock en Cliente
- **Decisión:** Configurar atributos `max` en los inputs HTML (`max="99999999"` en precio y `max="1000000"` en stock) y validar explícitamente en `handleSubmit` dentro de `ProductModal.tsx` antes de disparar la petición a `productService`.
- **Trade-off:**
  - *Ventaja:* Proporciona feedback instantáneo al usuario vía notificaciones Sonner sin incurrir en latencia de red ni provocar errores 400/500 en el backend.
  - *Compromiso:* Debe mantenerse sincronizado con los esquemas Zod del backend (`product.schema.ts`).

---

## 3. Criterios de Aceptación y Verificación

- Ingresar un precio superior a `$99.999.999 COP` bloquea el envío y muestra toast de error.
- Ingresar un stock superior a `1.000.000` bloquea el envío y muestra toast de error.
- Los inputs numéricos preservan la protección contra `onWheel` (scroll accidental).
