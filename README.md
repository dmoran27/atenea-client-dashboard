# 💻 Atenea Client Dashboard

> Dashboard administrativo interactivo para clientes del sistema **Atenea**, enfocado en la gestión en tiempo real de solicitudes de reserva, agendas y configuración de la cuenta.

![Vue 3](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🌐 Ecosistema de Arquitectura

Este repositorio forma parte de una arquitectura modular desacoplada (_Multi-repo_) basada en microservicios y micro-frontends:

- ⚙️ **Atenea Engine (NestJS):** _(En desarrollo)_ Microservicio dedicado al motor de disponibilidad y gestión de citas de alta concurrencia.
- 💻 **Atenea Client Dashboard (Vue 3):** _Estás aquí._ Aplicación Single Page Application (SPA) para la interfaz de gestión del cliente final.
- 🏢 **Atenea Core (Laravel/Filament):** _(Repositorio Privado)_ Núcleo central multi-tenant, motor de suscripciones y lógica de negocio administrativa.
- 🛍️ **Atenea Web (Next.js/React):** _(En desarrollo / Próximamente)_ Storefront público con SSR y optimización SEO para que los clientes finales accedan a la página principal del sitio.

## 🚀 Características Principales

- **Gestión Dinámica de Reservas:** Vista conmutable entre **Tabla** interactiva y **Calendario** para un control completo de citas.
- **Flujos Interactivos de Cancelación y Reprogramación:** Modales contextuales dinámicos según el estado de la solicitud (`PENDING`, `APPROVED`, `CANCELLED`).
- **Internacionalización (i18n):** Soporte multi-idioma mediante claves centralizadas en JSON para evitar hardcoding de cadenas de texto.
- **Soporte Multitenant Dinámico:** _(En desarrollo / Próximamente)_ Inyección automática del identificador del cliente (`X-Tenant-ID`) en cada solicitud HTTP leyendo el subdominio o contexto actual.
- **Desarrollo Desacoplado (Mock Data):** Capacidad de simulación de estado local para prototipado rápido e interactivo en memoria sin dependencia de conectividad al backend.
- **Arquitectura de Widgets y Rutas Dinámicas:** Registro y descubrimiento automático mediante `import.meta.glob`.

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
├── core/                    # Núcleo global, componentes UI base, layouts y router
│   ├── api/                 # Configuración central del cliente HTTP e interfaces
│   ├── components/          # Componentes estructurales (Admin layout, UI atómica)
│   ├── composables/         # Hooks globales (tema, utilidades compartidas)
│   ├── config/              # Constantes globales y variables de entorno tipadas
│   ├── layouts/             # Contenedores principales de vistas (AdminLayout, AuthLayout)
│   ├── lib/                 # Funciones puras de ayuda (formateo, fechas, cn)
│   ├── locales/             # Traducciones globales compartidas (i18n)
│   ├── mocks/               # Datos estáticos para prototipado sin backend
│   ├── router/              # Configuración del router central y auto-descubrimiento
│   └── stores/              # Estados globales de la aplicación (Pinia)
├── modules/                 # Módulos de dominio específicos (Desacoplados)
│   ├── auth/                # Vistas, componentes y rutas de autenticación
│   ├── bookings/            # Gestión de reservas, disponibilidad y calendario
│   │   ├── api/             # Interfaces y endpoints específicos del módulo
│   │   ├── components/      # Componentes del módulo (BookingActions, Modals)
│   │   ├── composables/     # Hooks de dominio (useBookings, useBookingServices, etc.)
│   │   ├── routes.ts        # Rutas hijas del módulo
│   │   ├── views/           # Vistas principales del módulo
│   │   └── widgets/         # Widgets registrables (BookingsStats, NextBooking)
│   └── dashboard/           # Panel principal e integrador de widgets
├── App.vue                  # Componente raíz de Vue
└── main.ts                  # Punto de entrada y Bootstrap de la app
```

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

## 🧪 Modo Mock (Desarrollo Desacoplado)

El **Modo Mock** es una característica de la arquitectura de este proyecto que permite desarrollar, probar y maquetar toda la interfaz de usuario sin necesidad de tener los servicios backend (Laravel/NestJS) en ejecución o finalizados.

Al activar este modo, la aplicación intercepta las llamadas a los servicios centrales e inyecta respuestas simuladas con datos estáticos locales (ubicados en los archivos `*.mock.ts`).

## ¿Cómo activarlo?

Simplemente cambia el valor de la variable de entorno en tu archivo `.env.development`:

```env
# Cambiar a 'true' para usar datos locales simulados
VITE_USE_MOCKS=true
```

(Nota: Deberás reiniciar el servidor de desarrollo npm run dev para que Vite recargue las variables de entorno).

## Estructura y Patrón de Diseño

El sistema utiliza un patrón de estrategia (Strategy Pattern) en la capa de servicios (src/core/api/). Cada módulo expone una interfaz estricta (ej. IAuthApi) que es implementada por 4 archivos:

- *.http.ts: Realiza la llamada real mediante Axios al servidor.
- *.mock.ts: Devuelve una Promesa simulando la respuesta del servidor (incluyendo delays artificiales para probar estados de carga en TanStack Query).
- *.interface.ts: Es el contrato para que http y mock tengan las misma definicion de funciones.
- El archivo index.ts de cada servicio evalúa la variable de entorno e inyecta dinámicamente la implementación correspondiente, dejando el resto de la aplicación (stores, componentes) totalmente agnóstico al origen de los datos.

## Beneficios

- **Desarrollo en paralelo:** El equipo frontend puede avanzar creando flujos completos mientras el equipo backend desarrolla los endpoints.
- **Prototipado rápido:** Permite validar flujos de UX/UI interactuando con estados de éxito, error o carga sin tocar bases de datos.
- **Pruebas deterministas:** Garantiza que los datos siempre sean los mismos al hacer pruebas visuales o unitarias.

## 🧩 Arquitectura Modular & Extensibilidad

Este dashboard utiliza un patrón de **auto-descubrimiento (Auto-discovery)** basado en las capacidades de importación dinámica de Vite (`import.meta.glob`). Esto elimina la necesidad de registrar rutas o widgets manualmente en archivos centrales.

---

### 1. 📦 Estructura de un Módulo de Dominio

Los módulos se ubican dentro de `src/modules/` y deben seguir una estructura estándar:

```text
src/modules/booking/
├── api/             # Interfaces, llamadas HTTP y mocks específicos del módulo
├── components/      # Componentes exclusivos del módulo
├── composables/     # Lógica de negocio reutilizable (ej. useBookings)
├── routes.ts        # Declaración de rutas hijas del módulo (auto-descubiertas)
├── views/           # Vistas principales declaradas como páginas
└── widgets/         # Widgets dinámicos registrables en el Dashboard
```

### 2. 🛣️ Auto-descubrimiento de Rutas

El Router central lee dinámicamente todos los archivos routes.ts presentes en los módulos dentro de src/modules/.

#### ¿Cómo agregar un nuevo módulo con rutas?

Crea un archivo routes.ts dentro de tu módulo exportando un objeto de ruta o un array de rutas:

```TypeScript
// src/modules/mi-modulo/routes.ts
import { Ticket } from '@lucide/vue'
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: 'mi-modulo', // Nota: Sin barra '/' inicial para mantener la jerarquía de rutas hijas de /admin
    name: 'admin.mi-modulo',
    component: () => import('./views/MiModuloView.vue'),
    meta: {
      title: 'Mi Módulo',
      titleKey: 'miModulo.view.title', //key correspondiente a la traduccion
      showInNav: true, //Si mostrar en el menu lateral
      moduleKey: 'modulo-key',  //Llave para saber si se muestra o no este modulo dependiend de la configuracin tenet del usurio
      order: 3, //orden que se muestra en el menu
      soon: false,
      icon: Ticket, //icono

    },
  },
]

```

El núcleo (src/core/router) importará e inyectará automáticamente estas rutas dentro de la plantilla del administrador.

### 3. 📊 Registro y Descubrimiento Automático de Widgets

El Dashboard principal carga widgets de forma dinámica según la configuración del cliente/tenant mediante el composable useWidgetRegistry.

#### ¿Cómo crear y registrar un nuevo Widget?

Crea la carpeta del widget dentro del directorio widgets/ de tu módulo siguiendo la convención de nombres:

```text
src/modules/booking/widgets/
└── BookingsStatsWidget/
    └── index.vue    # Componente principal del widget

```

Implementa el componente index.vue:

```vue
<!-- src/modules/booking/widgets/BookingsStatsWidget/index.vue -->
<script setup lang="ts">
import { Card, CardContent } from '@/core/components/ui/card'

// Lógica del widget usando los composables de su módulo
</script>

<template>
  <Card>
    <CardContent>
      <!-- Contenido visual del widget -->
    </CardContent>
  </Card>
</template>
```

Registra tu componente

```TypeScript
// src/modules/booking/widgets/BookingsStatsWidget.vue
import { widgetRegistry } from '@/core/registry/widgetRegistry'
import BookingsStatsWidget from './components/widgets/BookingsStatsWidget.vue'

export function init() {
  widgetRegistry.register({
    id: 'booking-widget',
    component: BookingsStatsWidget,
    order: 5,
    colSpan: { sm: 12, lg: 'full' }, // Pantalla completa
  })
}

```

¡Listo! El motor de widgets registrará automáticamente el identificador BookingsStatsWidget mapeando import.meta.glob('../modules/**/widgets/**/index.vue'). Cuando la API del Dashboard solicite la renderización del widget "BookingsStatsWidget", se cargará e inyectará de forma asíncrona (lazy loading).
