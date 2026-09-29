# BioSoft — Frontend en React

Frontend del CMMS/ERP de gestión de equipo médico BioSoft (React + Vite).
Incluye: Login/Registro con planes, Dashboard, Equipos (con QR y escáner), Órdenes de
Trabajo, Kanban, Analítica, Historial General, Calendario, y 12 módulos adicionales de
calidad, seguridad, inventarios, certificados, ciclo de vida y planeación. Todos los
datos son de ejemplo y viven en memoria (se reinician al recargar la página); aún no
hay backend conectado en esta copia (ver el proyecto `biosoft-backend` para eso).

## Requisitos
- Node.js 18 o superior
- npm

## Instalación y ejecución local

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (normalmente `http://localhost:5173`).

## Generar la versión de producción

```bash
npm run build
npm run preview
```

Los archivos listos para publicar quedan en la carpeta `dist/`.

## Estructura del proyecto

```
src/
  main.jsx                 punto de entrada
  App.jsx                  enrutador de vistas + modales
  index.css                estilos y variables de diseño (tema BioSoft)
  data/
    mockData.js             constantes y datos de ejemplo de Equipos/Órdenes
    moduleConfig.js          configuración de los 12 módulos adicionales (ver abajo)
  context/AppContext.jsx    estado global (usuario, equipos, órdenes, y los 12 módulos)
  components/
    Login.jsx                landing + login + registro + planes
    Sidebar.jsx, Topbar.jsx   navegación agrupada por secciones
    Dashboard.jsx             tarjetas resumen + gráficas (recharts)
    Equipos.jsx               listado, filtros, buscador
    Ordenes.jsx               listado de órdenes de trabajo
    Kanban.jsx                tablero arrastrable
    Analitica.jsx             gráficas de categoría / tipo / mes
    Historial.jsx             línea de tiempo general
    Calendario.jsx            calendario mensual de eventos
    GenericModule.jsx         componente genérico que renderiza los 12 módulos nuevos
    modals/                   formularios y detalles (equipo, orden, QR, escáner)
```

## Los 12 módulos nuevos (config-driven)

En vez de escribir 12 pantallas casi idénticas a mano, se construyó un solo componente
genérico (`GenericModule.jsx`) que arma automáticamente el listado, el buscador y el
formulario de alta/edición a partir de una configuración declarativa en
`src/data/moduleConfig.js`. Esto significa que **agregar o ajustar un módulo nuevo no
requiere tocar componentes de React** — solo se edita el objeto de configuración.

Los módulos incluidos, organizados por sección en el menú lateral:

- **Personal**: Usuarios por Rol Interno
- **Calidad y Seguridad**: Cuasifallas, Eventos Adversos, Eventos Centinela
- **Inventarios**: Inventario de Refacciones, Inventario de Analizadores y Simuladores
- **Certificados**: Certificados de Calibración, Certificados de Seguridad Eléctrica
- **Ciclo de Vida**: Bajas de Equipos, Informes de Obsolescencia
- **Planeación**: Planes de Mantenimiento, Rutas de Supervisión

### Cómo agregar un módulo nuevo (o campos a uno existente)

Edita `src/data/moduleConfig.js` y agrega una entrada al objeto `MODULES`, por ejemplo:

```js
miModuloNuevo: {
  label: 'Mi módulo nuevo',
  icon: '📋',
  group: 'Planeación', // debe existir en MODULE_GROUPS, o agrega uno nuevo ahí
  description: 'Descripción que se muestra arriba de la tabla.',
  columns: ['campoUno', 'campoDos'], // qué columnas se ven en la tabla
  fields: [
    { key: 'campoUno', label: 'Campo uno', type: 'text' },
    { key: 'campoDos', label: 'Campo dos', type: 'date' },
    { key: 'campoTres', label: 'Campo tres', type: 'select', options: ['A', 'B'] },
    { key: 'notas', label: 'Notas', type: 'textarea' },
  ],
  seed: () => [], // registros de ejemplo iniciales (opcional)
},
```

Tipos de campo soportados: `text`, `number`, `date`, `select` (con `options`), y
`textarea`. El módulo aparece automáticamente en el menú lateral, en la barra superior,
y con su propia pantalla de lista + alta/edición — sin necesidad de crear un componente
nuevo.

## Notas técnicas
- El código QR se genera con la librería `qrcode` (imagen descargable en PNG).
- El escaneo usa `html5-qrcode`: intenta cámara en vivo, permite subir una foto del
  código, y siempre ofrece una búsqueda manual como respaldo.
- Los PDF (hoja de vida del equipo y orden de trabajo) se generan con `jspdf`.
- Los datos están en memoria vía React Context — para producción real hay que
  conectar esto al backend (`biosoft-backend`) y, eventualmente, dar persistencia
  real a los 12 módulos nuevos (por ahora solo existen en el frontend).

## Próximos pasos sugeridos
- Conectar los 12 módulos nuevos al backend (tablas, endpoints y validación,
  siguiendo el mismo patrón usado para Equipos y Órdenes de Trabajo).
- Vincular los módulos de certificados y bajas directamente con la ficha del equipo
  correspondiente (hoy son registros independientes con el equipo como texto libre).
- Autenticación real (JWT) en vez del login de demostración.
- Envío real de correos para alertas y notificaciones.
