import { uid, iso, addDays, TODAY } from './mockData.js';

// Each module config drives the generic list + form (GenericModule.jsx):
// - fields: define the create/edit form (and their type)
// - columns: subset of fields (by key) shown in the table, in order
// - seed: initial example records so the module isn't empty on first load

const SEV_BAJA_MEDIA_ALTA = ['Baja', 'Media', 'Alta'];

export const MODULES = {
  usuariosInternos: {
    label: 'Usuarios por Rol Interno',
    icon: '👤',
    group: 'Personal',
    description: 'Personal interno del área de ingeniería biomédica y los roles operativos que desempeñan (distintos de los roles de acceso al sistema).',
    columns: ['nombre', 'rolInterno', 'departamento', 'estado'],
    fields: [
      { key: 'nombre', label: 'Nombre completo', type: 'text' },
      { key: 'correo', label: 'Correo', type: 'text' },
      { key: 'rolInterno', label: 'Rol interno', type: 'select', options: ['Jefe de Ingeniería Biomédica', 'Ingeniero Biomédico', 'Técnico de Mantenimiento', 'Auxiliar Técnico', 'Coordinador de Calidad', 'Practicante'] },
      { key: 'departamento', label: 'Departamento', type: 'text' },
      { key: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo'] },
    ],
    seed: () => [
      { id: uid('USR'), nombre: 'Carlos Ramírez', correo: 'c.ramirez@biosoft-tec.com', rolInterno: 'Ingeniero Biomédico', departamento: 'Ingeniería Biomédica', estado: 'Activo' },
      { id: uid('USR'), nombre: 'Marcela Ruiz', correo: 'm.ruiz@biosoft-tec.com', rolInterno: 'Técnico de Mantenimiento', departamento: 'Ingeniería Biomédica', estado: 'Activo' },
    ],
  },

  cuasifallas: {
    label: 'Cuasifallas',
    icon: '⚠️',
    group: 'Calidad y Seguridad',
    description: 'Situaciones en las que un equipo estuvo a punto de fallar o generar un incidente, pero no llegó a causar daño. Registrarlas ayuda a prevenir eventos adversos futuros.',
    columns: ['fecha', 'equipoRelacionado', 'severidadPotencial', 'causaProbable'],
    fields: [
      { key: 'equipoRelacionado', label: 'Equipo relacionado', type: 'text' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'descripcion', label: 'Descripción', type: 'textarea' },
      { key: 'causaProbable', label: 'Causa probable', type: 'text' },
      { key: 'accionTomada', label: 'Acción tomada', type: 'textarea' },
      { key: 'severidadPotencial', label: 'Severidad potencial', type: 'select', options: SEV_BAJA_MEDIA_ALTA },
    ],
    seed: () => [
      { id: uid('QF'), equipoRelacionado: 'Ventilador Mecánico (INV-2022-009)', fecha: iso(addDays(TODAY, -12)), descripcion: 'Alarma de baja presión se activó de forma intermitente sin causa aparente.', causaProbable: 'Posible falla en sensor de presión', accionTomada: 'Se realizó revisión preventiva anticipada, sin hallazgos concluyentes.', severidadPotencial: 'Alta' },
    ],
  },

  eventosAdversos: {
    label: 'Eventos Adversos',
    icon: '🩹',
    group: 'Calidad y Seguridad',
    description: 'Sucesos no deseados relacionados con el uso de un equipo médico que sí llegaron a afectar a un paciente u operador.',
    columns: ['fecha', 'equipoRelacionado', 'gravedad', 'pacienteAfectado'],
    fields: [
      { key: 'equipoRelacionado', label: 'Equipo relacionado', type: 'text' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'pacienteAfectado', label: '¿Paciente afectado?', type: 'select', options: ['Sí', 'No'] },
      { key: 'gravedad', label: 'Gravedad', type: 'select', options: ['Leve', 'Moderada', 'Grave'] },
      { key: 'descripcion', label: 'Descripción', type: 'textarea' },
      { key: 'accionesCorrectivas', label: 'Acciones correctivas', type: 'textarea' },
      { key: 'reportadoA', label: 'Reportado a (INVIMA, proveedor, etc.)', type: 'text' },
    ],
    seed: () => [],
  },

  eventosCentinela: {
    label: 'Eventos Centinela',
    icon: '🚨',
    group: 'Calidad y Seguridad',
    description: 'Eventos adversos de máxima gravedad (muerte o daño permanente severo) que requieren investigación obligatoria e inmediata.',
    columns: ['fecha', 'equipoRelacionado', 'resultado', 'estado'],
    fields: [
      { key: 'equipoRelacionado', label: 'Equipo relacionado', type: 'text' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'descripcion', label: 'Descripción del evento', type: 'textarea' },
      { key: 'resultado', label: 'Resultado (ej. daño permanente)', type: 'text' },
      { key: 'investigacion', label: 'Investigación realizada', type: 'textarea' },
      { key: 'accionesPreventivas', label: 'Acciones preventivas', type: 'textarea' },
      { key: 'estado', label: 'Estado', type: 'select', options: ['Abierto', 'En investigación', 'Cerrado'] },
    ],
    seed: () => [],
  },

  refacciones: {
    label: 'Inventario de Refacciones',
    icon: '🧰',
    group: 'Inventarios',
    description: 'Control de repuestos y partes usadas en el mantenimiento de equipo biomédico, con su stock disponible.',
    columns: ['nombreParte', 'codigo', 'cantidad', 'stockMinimo', 'ubicacionAlmacen'],
    fields: [
      { key: 'nombreParte', label: 'Nombre de la refacción', type: 'text' },
      { key: 'codigo', label: 'Código / referencia', type: 'text' },
      { key: 'equipoCompatible', label: 'Equipo(s) compatible(s)', type: 'text' },
      { key: 'cantidad', label: 'Cantidad en stock', type: 'number' },
      { key: 'stockMinimo', label: 'Stock mínimo', type: 'number' },
      { key: 'ubicacionAlmacen', label: 'Ubicación en almacén', type: 'text' },
      { key: 'proveedor', label: 'Proveedor', type: 'text' },
      { key: 'costoUnitario', label: 'Costo unitario', type: 'number' },
    ],
    seed: () => [
      { id: uid('RF'), nombreParte: 'Válvula espiratoria', codigo: 'VAL-EVITA-500', equipoCompatible: 'Dräger Evita V500', cantidad: 3, stockMinimo: 2, ubicacionAlmacen: 'Almacén Biomédico - Estante 4', proveedor: 'Dräger Colombia', costoUnitario: 850000 },
      { id: uid('RF'), nombreParte: 'Sensor de SpO2 reusable', codigo: 'SPO2-PHI-450', equipoCompatible: 'Philips IntelliVue MX450', cantidad: 6, stockMinimo: 3, ubicacionAlmacen: 'Almacén Biomédico - Estante 2', proveedor: 'Philips Colombia', costoUnitario: 320000 },
    ],
  },

  analizadores: {
    label: 'Inventario de Analizadores y Simuladores',
    icon: '🧪',
    group: 'Inventarios',
    description: 'Equipos de prueba (analizadores y simuladores) usados por el propio equipo biomédico para calibrar y verificar el resto del inventario.',
    columns: ['nombre', 'tipo', 'numeroSerie', 'proximaCalibracion', 'estado'],
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text' },
      { key: 'tipo', label: 'Tipo', type: 'select', options: ['Analizador', 'Simulador'] },
      { key: 'marca', label: 'Marca', type: 'text' },
      { key: 'modelo', label: 'Modelo', type: 'text' },
      { key: 'numeroSerie', label: 'Número de serie', type: 'text' },
      { key: 'proximaCalibracion', label: 'Próxima calibración', type: 'date' },
      { key: 'estado', label: 'Estado', type: 'select', options: ['Operativo', 'En calibración', 'Fuera de servicio'] },
    ],
    seed: () => [
      { id: uid('AN'), nombre: 'Analizador de Seguridad Eléctrica', tipo: 'Analizador', marca: 'Fluke Biomedical', modelo: 'ESA620', numeroSerie: 'ESA-9981', proximaCalibracion: iso(addDays(TODAY, 60)), estado: 'Operativo' },
      { id: uid('AN'), nombre: 'Simulador de Paciente Multiparamétrico', tipo: 'Simulador', marca: 'Fluke Biomedical', modelo: 'ProSim 8', numeroSerie: 'PS8-2210', proximaCalibracion: iso(addDays(TODAY, 20)), estado: 'Operativo' },
    ],
  },

  certCalibracion: {
    label: 'Certificados de Calibración',
    icon: '📜',
    group: 'Certificados',
    description: 'Certificados emitidos tras cada calibración realizada a un equipo, con su vigencia.',
    columns: ['equipoRelacionado', 'numeroCertificado', 'fechaVencimiento', 'resultado'],
    fields: [
      { key: 'equipoRelacionado', label: 'Equipo relacionado', type: 'text' },
      { key: 'numeroCertificado', label: 'Número de certificado', type: 'text' },
      { key: 'fechaEmision', label: 'Fecha de emisión', type: 'date' },
      { key: 'fechaVencimiento', label: 'Fecha de vencimiento', type: 'date' },
      { key: 'entidadCertificadora', label: 'Entidad certificadora', type: 'text' },
      { key: 'resultado', label: 'Resultado', type: 'select', options: ['Aprobado', 'Aprobado con observaciones', 'Rechazado'] },
    ],
    seed: () => [
      { id: uid('CC'), equipoRelacionado: 'Equipo de Rayos X Fijo (INV-2023-014)', numeroCertificado: 'CAL-2025-0231', fechaEmision: iso(addDays(TODAY, -320)), fechaVencimiento: iso(addDays(TODAY, 15)), entidadCertificadora: 'MedTech Services S.A.S.', resultado: 'Aprobado' },
    ],
  },

  certElectrica: {
    label: 'Certificados de Seguridad Eléctrica',
    icon: '⚡',
    group: 'Certificados',
    description: 'Certificados de las pruebas de seguridad eléctrica (fuga de corriente, puesta a tierra) realizadas a cada equipo.',
    columns: ['equipoRelacionado', 'numeroCertificado', 'fechaVencimiento', 'resultado'],
    fields: [
      { key: 'equipoRelacionado', label: 'Equipo relacionado', type: 'text' },
      { key: 'numeroCertificado', label: 'Número de certificado', type: 'text' },
      { key: 'fechaEmision', label: 'Fecha de emisión', type: 'date' },
      { key: 'fechaVencimiento', label: 'Fecha de vencimiento', type: 'date' },
      { key: 'entidadCertificadora', label: 'Entidad certificadora', type: 'text' },
      { key: 'resultado', label: 'Resultado', type: 'select', options: ['Aprobado', 'Rechazado'] },
    ],
    seed: () => [
      { id: uid('CE'), equipoRelacionado: 'Ventilador Mecánico (INV-2022-009)', numeroCertificado: 'SE-2025-0119', fechaEmision: iso(addDays(TODAY, -60)), fechaVencimiento: iso(addDays(TODAY, 305)), entidadCertificadora: 'BioMedical Care Ltda', resultado: 'Aprobado' },
    ],
  },

  bajas: {
    label: 'Bajas de Equipos',
    icon: '📦',
    group: 'Ciclo de Vida',
    description: 'Registro formal de los equipos que salen definitivamente de operación, con el motivo y disposición final.',
    columns: ['equipoRelacionado', 'fechaBaja', 'disposicionFinal', 'responsable'],
    fields: [
      { key: 'equipoRelacionado', label: 'Equipo relacionado', type: 'text' },
      { key: 'fechaBaja', label: 'Fecha de baja', type: 'date' },
      { key: 'motivo', label: 'Motivo', type: 'textarea' },
      { key: 'responsable', label: 'Responsable', type: 'text' },
      { key: 'disposicionFinal', label: 'Disposición final', type: 'select', options: ['Venta', 'Desecho', 'Donación', 'Devolución a proveedor'] },
      { key: 'documentoSoporte', label: 'Documento soporte (referencia)', type: 'text' },
    ],
    seed: () => [
      { id: uid('BJ'), equipoRelacionado: 'Ecógrafo Portátil (INV-2024-020)', fechaBaja: iso(addDays(TODAY, -500)), motivo: 'Obsolescencia tecnológica, sin soporte de repuestos del fabricante.', responsable: 'Carlos Ramírez', disposicionFinal: 'Desecho', documentoSoporte: 'ACTA-BAJA-2025-004' },
    ],
  },

  obsolescencia: {
    label: 'Informes de Obsolescencia',
    icon: '📉',
    group: 'Ciclo de Vida',
    description: 'Evaluaciones periódicas del nivel de obsolescencia tecnológica de equipos o categorías completas, para planear su renovación.',
    columns: ['equipoOCategoria', 'fecha', 'nivelObsolescencia', 'responsable'],
    fields: [
      { key: 'equipoOCategoria', label: 'Equipo o categoría evaluada', type: 'text' },
      { key: 'fecha', label: 'Fecha del informe', type: 'date' },
      { key: 'nivelObsolescencia', label: 'Nivel de obsolescencia', type: 'select', options: ['Bajo', 'Medio', 'Alto', 'Crítico'] },
      { key: 'recomendacion', label: 'Recomendación', type: 'textarea' },
      { key: 'responsable', label: 'Responsable', type: 'text' },
    ],
    seed: () => [
      { id: uid('OB'), equipoOCategoria: 'Electrocardiógrafo (INV-2021-072)', fecha: iso(addDays(TODAY, -30)), nivelObsolescencia: 'Alto', recomendacion: 'Evaluar reemplazo en el próximo ciclo presupuestal; fabricante limita disponibilidad de repuestos.', responsable: 'Carlos Ramírez' },
    ],
  },

  planesMantenimiento: {
    label: 'Planes de Mantenimiento',
    icon: '🗓️',
    group: 'Planeación',
    description: 'Programas de mantenimiento preventivo definidos por equipo o categoría, con su frecuencia y tareas asociadas.',
    columns: ['nombrePlan', 'aplicaA', 'frecuencia', 'proximaEjecucion'],
    fields: [
      { key: 'nombrePlan', label: 'Nombre del plan', type: 'text' },
      { key: 'aplicaA', label: 'Aplica a (equipo o categoría)', type: 'text' },
      { key: 'frecuencia', label: 'Frecuencia', type: 'select', options: ['Semanal', 'Mensual', 'Trimestral', 'Semestral', 'Anual'] },
      { key: 'tareas', label: 'Tareas incluidas', type: 'textarea' },
      { key: 'responsable', label: 'Responsable', type: 'text' },
      { key: 'proximaEjecucion', label: 'Próxima ejecución', type: 'date' },
    ],
    seed: () => [
      { id: uid('PM'), nombrePlan: 'Mantenimiento preventivo - Soporte Vital', aplicaA: 'Categoría: Soporte Vital', frecuencia: 'Trimestral', tareas: 'Revisión de alarmas, calibración de sensores, prueba de baterías de respaldo.', responsable: 'Ingeniería Biomédica', proximaEjecucion: iso(addDays(TODAY, 40)) },
      { id: uid('PM'), nombrePlan: 'Mantenimiento preventivo - Imagenología', aplicaA: 'Categoría: Imagenología', frecuencia: 'Semestral', tareas: 'Revisión de generador, colimador y sistema de enfriamiento.', responsable: 'Ingeniería Biomédica', proximaEjecucion: iso(addDays(TODAY, 90)) },
    ],
  },

  rutas: {
    label: 'Rutas de Supervisión',
    icon: '🧭',
    group: 'Planeación',
    description: 'Recorridos periódicos de inspección visual y funcional por áreas del hospital, para detectar fallas antes de que se conviertan en órdenes de trabajo urgentes.',
    columns: ['nombreRuta', 'frecuencia', 'responsable', 'proximaEjecucion'],
    fields: [
      { key: 'nombreRuta', label: 'Nombre de la ruta', type: 'text' },
      { key: 'areasEquipos', label: 'Áreas / equipos incluidos', type: 'textarea' },
      { key: 'frecuencia', label: 'Frecuencia', type: 'select', options: ['Diaria', 'Semanal', 'Quincenal', 'Mensual'] },
      { key: 'responsable', label: 'Responsable', type: 'text' },
      { key: 'ultimaEjecucion', label: 'Última ejecución', type: 'date' },
      { key: 'proximaEjecucion', label: 'Próxima ejecución', type: 'date' },
    ],
    seed: () => [
      { id: uid('RT'), nombreRuta: 'Ronda UCI y Urgencias', areasEquipos: 'Monitores, ventiladores y bombas de infusión de UCI y Urgencias.', frecuencia: 'Semanal', responsable: 'Marcela Ruiz', ultimaEjecucion: iso(addDays(TODAY, -6)), proximaEjecucion: iso(addDays(TODAY, 1)) },
    ],
  },
};

export const MODULE_GROUPS = ['Personal', 'Calidad y Seguridad', 'Inventarios', 'Certificados', 'Ciclo de Vida', 'Planeación'];
