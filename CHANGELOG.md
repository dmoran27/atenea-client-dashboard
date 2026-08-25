# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2026-08-24

### added

- **Autenticación y Sesiones:** Implementación completa de `useAuthStore` para la gestión de tokens, persistencia segura y recuperación de sesión mediante `fetchUser`.
- **Arquitectura de APIs:** Capa de servicios desacoplada basada en interfaces (`AuthApi`, etc.) preparada para soportar consumo flexible y mocks.
- **Rutas Dinámicas y Navegación SaaS:** Generación automática y filtrado dinámico del menú lateral (`navItems`) evaluando los permisos de módulos habilitados por el Tenant (`tenantStore.hasModule`).
- **Internacionalización:** Soporte robusto de traducciones por módulo utilizando `vue-i18n` y metadatos dinámicos integrados en el enrutador.
- **Bootstrap Asíncrono:** Patrón de inicialización `bootstrap()` en `main.ts` para gestionar un ciclo de vida ordenado de la aplicación.
- **Gestión de Caché:** Archivo centralizado `src/core/plugins/vue-query.ts` para aislar y manejar las opciones globales de TanStack Query (`staleTime`, `gcTime`, reintentos y foco de ventana).
- **UI:** Implementación de la vista inicial del Dashboard consumiendo el nombre del usuario de forma reactiva y segura con `useAuthStore()`.

### changed

- **Rendimiento:** Optimización de la carga inicial utilizando `Promise.all` para resolver en paralelo la configuración del Tenant (`fetchTenantConfig`) y la sesión del usuario (`fetchUser`) antes de montar Vue.
- **Arquitectura de Router:** Modularización completa de los _guards_ de navegación trasladándolos a `src/core/router/guards.ts` para separar la lógica de autenticación, invitados y validación de módulos.
- Validacion de los formulrios de login y registro

### fixed

- Inicialización prematura de los _stores_ de Pinia en las rutas: Se movió la ejecución de `useAuthStore()` dentro de las funciones de los _guards_ para evitar el error de _"getActivePinia was not found"_ al arrancar la app.
- Resolución de conflictos con caracteres especiales y variables en placeholders de `vue-i18n`.

## [0.1.0] - 2026-08-22

### added

- Estructura de carpetas arquitectónica orientada a módulos (`api`, `components`, `composables`, `modules`, `stores`, `types`, etc.).
- Configuración inicial del proyecto con Vue 3, TypeScript y Vite.
- Configuración base para internalización (`locales`) y utilidades globales.
