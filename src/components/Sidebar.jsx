import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { MODULES, MODULE_GROUPS } from '../data/moduleConfig.js';

const CORE_NAV = [
  { key:'dashboard', label:'Dashboard', ic:'◧' },
  { key:'equipos', label:'Equipos', ic:'⚙' },
  { key:'ordenes', label:'Órdenes de Trabajo', ic:'🛠' },
  { key:'kanban', label:'Kanban', ic:'▤' },
  { key:'analitica', label:'Analítica', ic:'📊' },
  { key:'historial', label:'Historial General', ic:'≡' },
  { key:'calendario', label:'Calendario', ic:'📅' },
];

// Build one nav entry per module in moduleConfig.js, grouped by their `group`.
const MODULE_NAV_BY_GROUP = MODULE_GROUPS.map(group => ({
  group,
  items: Object.entries(MODULES)
    .filter(([, cfg]) => cfg.group === group)
    .map(([key, cfg]) => ({ key, label: cfg.label, ic: cfg.icon })),
}));

export default function Sidebar(){
  const { view, setView, user, logout } = useApp();
  const initials = (user?.name || 'BS').split(' ').filter(Boolean).map(s=>s[0]).slice(0,2).join('').toUpperCase();

  return (
    <aside className="sidebar">
      <div className="brand-mark"><span className="dot"></span><span>BIOSOFT</span></div>

      <div className="nav-section-label">Principal</div>
      <ul className="navlist">
        {CORE_NAV.map(n => (
          <li key={n.key}>
            <button className={view===n.key ? 'active' : ''} onClick={()=>setView(n.key)}>
              <span className="ic">{n.ic}</span>{n.label}
            </button>
          </li>
        ))}
      </ul>

      {MODULE_NAV_BY_GROUP.map(({ group, items }) => (
        <React.Fragment key={group}>
          <div className="nav-section-label">{group}</div>
          <ul className="navlist">
            {items.map(n => (
              <li key={n.key}>
                <button className={view===n.key ? 'active' : ''} onClick={()=>setView(n.key)}>
                  <span className="ic">{n.ic}</span>{n.label}
                </button>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}

      <div className="sidebar-foot">
        <div className="user-chip">
          <div className="avatar">{initials || 'BS'}</div>
          <div className="who">
            <div className="name">{user?.name || 'Director(a)'}</div>
            <div className="role">{user?.role || 'Dirección de Ingeniería Biomédica'}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>Cerrar sesión</button>
      </div>
    </aside>
  );
}
