# 💻 Atenea Client Dashboard

> Dashboard administrativo interactivo para clientes del sistema **Atenea**, enfocado en la gestión en tiempo real de solicitudes de reserva, agendas y configuración de la cuenta.

---

## 🌐 Ecosistema de Arquitectura

Este repositorio forma parte de una arquitectura modular desacoplada (*Multi-repo*) basada en microservicios y micro-frontends:

* ⚙️ **[Atenea Engine (NestJS)](https://github.com/dmoran27/atenea-engine):** Microservicio público dedicado al motor de disponibilidad y gestión de citas de alta concurrencia.
* 💻 **Atenea Client dashboard (Vue 3):** *Estás aquí.* Aplicación Single Page Application (SPA) para la interfaz de gestión del cliente final.
* 🏢 **Atenea Core (Laravel/Filament):** *(Repositorio Privado)* Núcleo central multi-tenant, motor de suscripciones y lógica de negocio administrativa.
* 🛍️ **[Atenea Web (Next.js/React)]:** *(En desarrollo / Próximamente)* Storefront público con SSR y optimización SEO para que los clientes finales accedan a la pagina principal del sitio.

---

## 🚀 Características Principales

* **Gestión Dinámica de Reservas:** Vista conmutable entre **Tabla** interactiva y **Calendario** para un control completo de citas.
* **Flujos Interactivos de Cancelación y Reprogramación:** Modales contextuales dinámicos según el estado de la solicitud (`PENDING`, `APPROVED`, `CANCELLED`).
* **Internacionalización (i18n):** Soporte multi-idioma mediante claves centralizadas en JSON para evitar hardcoding de cadenas de texto.
* **Soporte Multitenant Dinámico:** Inyección automática del identificador del cliente (`X-Tenant-ID`) en cada solicitud HTTP leyendo el subdominio o contexto actual.
* **Desarrollo Desacoplado (Mock Data):** Capacidad de simulación de estado local para prototipado rápido e interactivo en memoria sin dependencia de conectividad al backend.

---

## 🛠️ Stack Tecnológico

* **Framework:** Vue 3 (Composition API con `<script setup>`)
* **Build Tool:** Vite
* **Lenguaje:** TypeScript (Tipado estricto)
* **Estilos & UI:** Tailwind CSS + Componentes inspirados en `shadcn-vue`
* **Iconos:** Lucide Icons (`lucide-vue-next`)
* **Gestión de Estado & Rutas:** Pinia & Vue Router
* **Internacionalización:** Vue-i18n (v9)
* **Cliente HTTP:** Axios (Con interceptores de contexto)

---

## 📁 Estructura del Proyecto

``` text

src/
├── api/                  # Instancias de Axios e interceptores (Tenant ID, Auth)
├── assets/               # CSS global (Tailwind), fuentes e imágenes
├── components/           # Componentes UI globales
│   ├── ui/               # Atómicos de diseño (shadcn-vue: Button, Modal, Input)
│   └── layout/           # Estructura del dashboard (Sidebar, Navbar, AppLayout)
├── composables/          # Composables globales de UI (useModal, useNotification)
├── config/               # Constantes de app (rutas, enums de estados, límites)
├── locales/              # JSONs de traducción (es.json, en.json)
├── mocks/                # Mock data para prototipado
├── modules/              # Módulos de dominio de negocio
│   └── bookings/         
│       ├── components/   #  ├── BookingsTable.vue, CalendarView.vue
│       ├── composables/  #  ├── useBookings.ts
│       ├── services/     #  ├── bookings.service.ts (llamadas API del módulo)
│       ├── stores/       #  ├── bookings.store.ts (pinia específico del módulo)
│       ├── types/        #  ├── booking.interface.ts
│       └── views/        #  └── BookingsView.vue
├── plugins/              # Inicialización de librerías (i18n.ts, pinia.ts)
├── router/               # Rutas y Navigation Guards
├── services/             # Servicios globales (Extractores de Tenant, Auth storage)
├── stores/               # Stores globales de Pinia (auth.store.ts, tenant.store.ts)
├── types/                # Interfaces y DTOs globales de TypeScript
├── utils/                # Helpers puros (formatters, date utils, validators)
├── views/                # Vistas globales no ligadas a módulos (Login, NotFound)
├── App.vue
└── main.ts
```

---

## ⚙️ Configuración e Instalación Local

### Prerrequisitos
- Node.js v18.x o superior
- npm o pnpm

### Pasos

1. Clonar el repositorio:
``` Bash
git clone https://github.com/dmoran27/atenea-client-dashboard
cd atenea-client-dashboard
``` 

2. Instalar dependencias:
``` Bash
npm install
``` 

3. Configurar Variables de Entorno:
Crea un archivo .env.development en la raíz del proyecto:

``` text
VITE_LARAVEL_API_URL=http://localhost:8000/api
VITE_NEST_API_URL=http://localhost:3000/api
``` 

4. Iniciar Servidor de Desarrollo:
``` Bash
npm run dev
``` 

La aplicación estará disponible en http://localhost:5173.

--

### Compilar y recargar en tiempo real para el desarrollo

```bash
npm run dev
```

### Comprobar tipos, compilar y minificar para producción

```bash
npm run build
```

### Ejecutar pruebas unitarias con [Vitest](https://vitest.dev/)

```bash
npm run test:unit
```

### Comprobar el código con [ESLint](https://eslint.org/)

```bash
npm run lint
```


---

## 🛡️ Manejo de Multitenancy y Red
El cliente HTTP automáticamente intercepta todas las peticiones salientes y adjunta la cabecera del tenant actual para garantizar el aislamiento de datos entre clientes:

TypeScript
// Ejemplo de Interceptor Axios
apiClient.interceptors.request.use((config) => {
  config.headers['X-Tenant-ID'] = getTenantIdFromSubdomain();
  return config;
});

