# Especificación de Arquitectura Frontend 04 · Vistas de Autenticación & Slider Card

**Fase:** Vistas Unificadas de Login y Registro con Transición Deslizable  
**Rama:** `feat/auth-views`  
**Estado:** Completado  
**Revisión:** Equipo de Ingeniería Vyrtium  

---

## 1. Contexto y Necesidad Técnica

Para una experiencia de usuario moderna y fluida, los flujos de inicio de sesión (`/login`) y registro (`/registro`) conviven en un componente deslizable único (`AuthSliderCard`). Este diseño utiliza animaciones CSS aceleradas por hardware para alternar entre ambos formularios con un panel superpuesto curvado en gradiente púrpura/índigo sin recargas de página completas.

---

## 2. Decisiones de Arquitectura (ADR)

### ADR F04.1: Componente Unificado `AuthSliderCard` con Estado Conmutable
- **Decisión:** Desarrollar `AuthSliderCard` recibiendo `initialMode?: 'login' | 'register'` para sincronizar la posición inicial según la URL (`/login` o `/registro`).
- **Justificación:** Centraliza la lógica de autenticación en un único componente mantenible, permitiendo transiciones inmediatas en el cliente sin latencia de red.

### ADR F04.2: Integración Directa con `AuthContext`
- **Decisión:** Invocar `login(credentials)` y `register(data)` expuestos por `useAuth()`, manejando el ciclo completo de obtención de JWTs (Access + Refresh), almacenamiento y redirección a `/dashboard`.
- **Justificación:** Mantiene desacoplada la presentación visual de la persistencia de tokens y el refresco automático de sesión.

### ADR F04.3: Manejo Estricto de Validaciones y Notificaciones Sonner
- **Decisión:** Validar longitud mínima de 8 caracteres en contraseña, formato de email y campos obligatorios antes del envío, informando al usuario mediante toasts tipados (`toast.error` / `toast.success`).
- **Justificación:** Ofrece retroalimentación instantánea antes de golpear el backend y presenta mensajes de error del servidor de forma clara y no intrusiva.

---

## 3. Estructura de Componentes

```text
src/
├── app/
│   ├── login/
│   │   └── page.tsx                # Host de AuthSliderCard con initialMode="login"
│   └── registro/
│       └── page.tsx                # Host de AuthSliderCard con initialMode="register"
└── components/
    └── auth/
        ├── AuthSliderCard.tsx      # Tarjeta con animación deslizante y formularios duales
        └── ProtectedRoute.tsx      # Route guard para rutas protegidas del panel
```

---

## 4. Criterios de Aceptación y Verificación

- La ruta `/login` renderiza el formulario de inicio de sesión con el panel decorativo a la izquierda.
- Al presionar "Registrarse", el panel se desliza fluidamente hacia la derecha revelando el formulario de registro.
- El registro invoca `POST /api/auth/register`, almacena tokens y redirige al dashboard (disparando el email de bienvenida vía Resend en el backend).
- El login invoca `POST /api/auth/login`, almacena tokens y redirige al dashboard.
- `pnpm build` compila con 0 errores de TypeScript y 0 warnings.
