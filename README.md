# 💻 Atenea Client Dashboard

> Dashboard administrativo interactivo para clientes del sistema **Atenea**, enfocado en la gestión en tiempo real de solicitudes de reserva, agendas y configuración de la cuenta.

![Vue 3](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🌐 Ecosistema de Arquitectura

Este repositorio forma parte de una arquitectura modular desacoplada (_Multi-repo_) basada en microservicios y micro-frontends:

- ⚙️ **[Atenea Engine (NestJS)](https://github.com/dmoran27/atenea-engine):** Microservicio público dedicado al motor de disponibilidad y gestión de citas de alta concurrencia.
- 💻 **Atenea Client dashboard (Vue 3):** _Estás aquí._ Aplicación Single Page Application (SPA) para la interfaz de gestión del cliente final.
- 🏢 **Atenea Core (Laravel/Filament):** _(Repositorio Privado)_ Núcleo central multi-tenant, motor de suscripciones y lógica de negocio administrativa.
- 🛍️ **[Atenea Web (Next.js/React)]:** _(En desarrollo / Próximamente)_ Storefront público con SSR y optimización SEO para que los clientes finales accedan a la pagina principal del sitio.

## 🚀 Características Principales

- **Gestión Dinámica de Reservas:** Vista conmutable entre **Tabla** interactiva y **Calendario** para un control completo de citas.
- **Flujos Interactivos de Cancelación y Reprogramación:** Modales contextuales dinámicos según el estado de la solicitud (`PENDING`, `APPROVED`, `CANCELLED`).
- **Internacionalización (i18n):** Soporte multi-idioma mediante claves centralizadas en JSON para evitar hardcoding de cadenas de texto.
- **Soporte Multitenant Dinámico:** Inyección automática del identificador del cliente (`X-Tenant-ID`) en cada solicitud HTTP leyendo el subdominio o contexto actual.
- **Desarrollo Desacoplado (Mock Data):** Capacidad de simulación de estado local para prototipado rápido e interactivo en memoria sin dependencia de conectividad al backend.

## 🛠️ Stack Tecnológico

- **Framework:** Vue 3 (Composition API con `<script setup>`)
- **Build Tool:** Vite
- **Lenguaje:** TypeScript (Tipado estricto)
- **Estilos & UI:** Tailwind CSS + Componentes inspirados en `shadcn-vue`
- **Iconos:** Lucide Icons (`@lucide/vue`)
- **Gestión de Estado & Rutas:** Pinia & Vue Router
- **Internacionalización:** Vue-i18n (v9)
- **Cliente HTTP:** Axios (Con interceptores de contexto)

## 📁 Estructura del Proyecto

```text

src/
├── core/
│   ├── api/                 # Capa de servicios centralizada para llamadas HTTP
│   │   ├── auth/            # Endpoints, interfaces y mocks de autenticación
│   │   ├── notification/    # Endpoints para notificaciones
│   │   ├── tenant/          # Endpoints y gestión del Tenant
│   │   └── client.ts        # Configuración base del cliente HTTP (interceptores)
│   ├── components/
│   │   ├── admin/           # Componentes estructurales del panel (Layout admin)
│   │   └── ui/              # Componentes atómicos reutilizables (shadcn-vue)
│   ├── composables/         # Hooks globales (ej. gestión de tema claro/oscuro)
│   ├── config/              # Constantes globales y variables de entorno tipadas
│   ├── layouts/             # Contenedores principales de vistas (Admin, Auth)
│   ├── lib/                 # Funciones puras de ayuda (formateo, fechas, cn)
│   ├── locales/             # Traducciones globales compartidas (i18n)
│   ├── mocks/               # Datos estáticos para prototipado sin backend
│   ├── plugins/             # Inicialización de librerías (i18n, vue-query)
│   ├── router/              # Configuración global del enrutamiento y guards
│   ├── stores/              # Estados globales de la aplicación (Pinia)
│   └── types/               # Definiciones de TypeScript globales
├── modules/                 # Módulos de dominio específicos (Funcionalidades)
│   ├── auth/                # Vistas, componentes y rutas de autenticación
│   └── dashboard/           # Vistas y rutas del panel principal
├── App.vue                  # Componente raíz de Vue
└── main.ts                  # Punto de entrada (Bootstrap y montaje de la app)
```

(Nota: Estructura resumida a nivel de directorios principales para facilitar la lectura).

## ⚙️ Configuración e Instalación Local

### Prerrequisitos

- Node.js v18.x o superior
- npm o pnpm

### Pasos

1. Clonar el repositorio:

```Bash
git clone https://github.com/dmoran27/atenea-client-dashboard
cd atenea-client-dashboard
```

2. Instalar dependencias:

```Bash
npm install
```

3. Configurar Variables de Entorno:
   Crea un archivo .env.development en la raíz del proyecto:

```text
VITE_LARAVEL_API_URL=http://localhost:8000/api
VITE_NEST_API_URL=http://localhost:3000/api
```

4. Iniciar Servidor de Desarrollo:

```Bash
npm run dev
```

La aplicación estará disponible en http://localhost:5173.

## 📜 Scripts Útiles de Desarrollo

- **`npm run build`**: Comprueba tipos, compila y minifica el proyecto para producción.
- **`npm run test:unit`**: Ejecuta las pruebas unitarias con Vitest.
- **`npm run lint`**: Comprueba el código con ESLint para mantener consistencia.

## 🧪 Modo Mock (Desarrollo Desacoplado)

El **Modo Mock** es una característica de la arquitectura de este proyecto que permite desarrollar, probar y maquetar toda la interfaz de usuario sin necesidad de tener los servicios backend (Laravel/NestJS) en ejecución o finalizados.

Al activar este modo, la aplicación intercepta las llamadas a los servicios centrales e inyecta respuestas simuladas con datos estáticos locales (ubicados en los archivos `*.mock.ts` y la carpeta `src/mocks/`).

## ¿Cómo activarlo?

Simplemente cambia el valor de la variable de entorno en tu archivo `.env.development`:

```env
# Cambiar a 'true' para usar datos locales simulados
VITE_USE_MOCKS=true
```

(Nota: Deberás reiniciar el servidor de desarrollo npm run dev para que Vite recargue las variables de entorno).

## Estructura y Patrón de Diseño

El sistema utiliza un patrón de estrategia (Strategy Pattern) en la capa de servicios (src/core/api/). Cada módulo expone una interfaz estricta (ej. IAuthApi) que es implementada por dos archivos:

*.http.ts: Realiza la llamada real mediante Axios al servidor.

*.mock.ts: Devuelve una Promesa simulando la respuesta del servidor (incluyendo delays artificiales para probar estados de carga en TanStack Query).

El archivo index.ts de cada servicio evalúa la variable de entorno e inyecta dinámicamente la implementación correspondiente, dejando el resto de la aplicación (stores, componentes) totalmente agnóstico al origen de los datos.

## Beneficios

- **Desarrollo en paralelo:** El equipo frontend puede avanzar creando flujos completos mientras el equipo backend desarrolla los endpoints.
- **Prototipado rápido:** Permite validar flujos de UX/UI interactuando con estados de éxito, error o carga sin tocar bases de datos.
- **Trabajo offline:** Ideal para programar sin conexión a internet o VPNs restrictivas.
- **Pruebas deterministas:** Garantiza que los datos siempre sean los mismos al hacer pruebas visuales o unitarias.
