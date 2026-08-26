# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2] - 2026-08-26

### Fixed

- Renombrado de la implementación del servicio de autenticación (`authApiReal` a `authApiHttp`).

### Changed

- Migración de composables de tema e idioma (`useTheme`, `useLanguage`) a un store centralizado de Pinia (`usePreferencesStore`).

## [0.2.1] - 2026-08-26

### added

- Módulo Global de Reservas (Booking): Implementación integral del nuevo módulo para la administración, consulta y gestión del flujo de vida de reservas.
- Modal detallado de lectura (BookingViewModal) para la inspección de información de servicios, clientes, fechas, modalidades y observaciones.
- Modal detallado la creacion y reagendamiento de reservas.
- Menú contextual de acciones rápidas (BookingActionsMenu) para operaciones de visualización, reagendamiento y cancelación de reservas.
- Composables de dominio para el procesamiento de configuraciones, servicios y estados del módulo.
- Control de permisos y validaciones de reglas de negocio para reagendamiento y restricciones temporales.
- Cobertura completa de claves i18n para el módulo, incluyendo estados, modalidades, etiquetas de formulario, acciones y mensajes del sistema.

### Changed

- Optimizaciones de UX/UI en Modales:
- Rediseño de la jerarquía visual en componentes de diálogo, priorizando la legibilidad mediante divisores limpios y eliminando contenedores anidados.
- Integración de bloques callout visuales con bordes de acento para la lectura fluida de descripciones y notas.

### Fixed

- Normalizacion en las traducciones de los composables en el core
- Correccion en los utils globales

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
