# Especificación de Arquitectura Frontend 02 · Cliente API & Autenticación Global

**Fase:** Cliente HTTP Centralizado y Contexto Global de Autenticación
**Rama:** `feat/auth-context-api-client`
**Estado:** Completado
**Revisión:** Equipo de Ingeniería Vyrtium

---

## 1. Contexto y Necesidad Técnica

El frontend interactúa con una API protegida por una arquitectura de doble token (`accessToken` de 15 minutos y `refreshToken` de 7 días). Para proveer una experiencia de usuario fluida, las peticiones HTTP deben adjuntar automáticamente el token activo y, ante una expiración (`401 Unauthorized`), renovar la sesión en segundo plano de manera transparente (*Silent Token Refresh*) sin desloguear al usuario ni interrumpir su flujo.

Asimismo, el estado de autenticación (`user`, `isAuthenticated`, `isLoading`) debe estar disponible en todo el árbol de componentes mediante un contexto global de React.

---

## 2. Decisiones de Arquitectura (ADR)

### ADR F02.1: Interceptor Axios con Cola de Espera (Promise Queue)
- **Decisión:** Implementar en `src/services/api.ts` un interceptor de respuesta que captura errores `401`. Si se detecta expiración, se bloquean las peticiones simultáneas, se encolan en `failedQueue` y se dispara una única llamada a `POST /auth/refresh`. Al completarse, se procesa la cola reintentando todas las peticiones con el nuevo `accessToken`.
- **Justificación:** Previene la condición de carrera (*race condition*) donde múltiples peticiones paralelas emiten llamadas concurrentes a `/auth/refresh`, lo cual provocaría revocación prematura por rotación de tokens.

### ADR F02.2: Almacenamiento Seguro Compatible con SSR
- **Decisión:** Encapsular el acceso a `localStorage` dentro del helper `tokenStorage` con guardas `typeof window !== 'undefined'`.
- **Justificación:** Evita errores de hidratación (*hydration mismatch*) o caídas durante el renderizado estático del lado del servidor en Next.js.

### ADR F02.3: Contexto Global `AuthContext` y Hook `useAuth`
- **Decisión:** Crear `AuthContext` en `src/context/AuthContext.tsx` con métodos `login`, `register`, `logout` y `refreshUser`, e inicialización automática al montar la aplicación consultando `GET /auth/perfil`.
- **Justificación:** Centraliza el ciclo de vida de la sesión, facilitando el acceso reactivo al usuario autenticado en barras de navegación, modales y formularios.

### ADR F02.4: Guard de Rutas Protegidas (`ProtectedRoute`)
- **Decisión:** Crear el componente envoltorio `ProtectedRoute` en `src/components/auth/ProtectedRoute.tsx`.
- **Justificación:** Protege de forma declarativa cualquier página o layout dentro del panel administrativo (`/dashboard`), mostrando un spinner de carga mientras se verifica el token y redirigiendo al `/login` en caso de sesión inválida.

---

## 3. Estructura de Componentes y Servicios

```text
src/
├── types/
│   ├── api.ts                  # Interfaces ApiSuccessResponse, ApiErrorResponse, PaginatedData
│   ├── auth.ts                 # Interfaces User, AuthTokens, LoginDTO, RegisterDTO
│   ├── category.ts             # Interfaces Category, CreateCategoryDTO
│   └── product.ts              # Interfaces Product, CreateProductDTO, ProductFilterParams
├── services/
│   ├── api.ts                  # Cliente Axios singleton con cola de Auto-Refresh
│   └── auth.service.ts         # Capa de llamadas a /auth/* (login, registro, logout, perfil)
├── context/
│   └── AuthContext.tsx         # Provider de estado de sesión y hook useAuth()
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx  # HOC de protección de rutas privadas
└── app/
    └── layout.tsx              # RootLayout integrado con <AuthProvider>
```

---

## 4. Criterios de Aceptación y Verificación

- `pnpm build` compila con 0 errores de TypeScript.
- `apiClient` adjunta automáticamente la cabecera `Authorization: Bearer <accessToken>` en cada petición.
- `useAuth()` expone reactivamente el usuario actual y el estado `isLoading`.
- `ProtectedRoute` bloquea accesos no autenticados y redirige limpiamente a `/login`.
