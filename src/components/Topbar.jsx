import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { MODULES } from '../data/moduleConfig.js';

const CORE_META = {
  dashboard:{title:'Dashboard', crumb:'BIOSOFT / DASHBOARD'},
  equipos:{title:'Equipos', crumb:'BIOSOFT / EQUIPOS'},
  ordenes:{title:'Órdenes de Trabajo', crumb:'BIOSOFT / ÓRDENES DE TRABAJO'},
  kanban:{title:'Kanban', crumb:'BIOSOFT / KANBAN'},
  analitica:{title:'Analítica', crumb:'BIOSOFT / ANALÍTICA'},
  historial:{title:'Historial General', crumb:'BIOSOFT / HISTORIAL GENERAL'},
  calendario:{title:'Calendario', crumb:'BIOSOFT / CALENDARIO'},
};

// Auto-generate breadcrumb metadata for the 12 config-driven modules.
const MODULE_META = Object.fromEntries(
  Object.entries(MODULES).map(([key, cfg]) => [key, { title: cfg.label, crumb: `BIOSOFT / ${cfg.group.toUpperCase()} / ${cfg.label.toUpperCase()}` }])
);

const META = { ...CORE_META, ...MODULE_META };

export default function Topbar(){
  const { view } = useApp();
  const meta = META[view] || META.dashboard;
  const dateStr = new Date().toLocaleDateString('es-CO', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  return (
    <div className="topbar">
      <div>
        <h1>{meta.title}</h1>
        <div className="crumb">{meta.crumb}</div>
      </div>
      <div className="mono" style={{fontSize:12, color:'var(--ink-soft)'}}>{dateStr}</div>
    </div>
  );
}
