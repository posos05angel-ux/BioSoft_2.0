import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { CATEGORIAS, ESTADOS, RIESGOS, estadoBadge } from '../data/mockData.js';

export default function Equipos(){
  const { equipos, openModal } = useApp();
  const [q, setQ] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('');
  const [riesgo, setRiesgo] = useState('');

  const list = useMemo(() => equipos.filter(e => {
    if(q && !(e.nombre.toLowerCase().includes(q.toLowerCase()) || e.numeroInventario.toLowerCase().includes(q.toLowerCase()) || e.numeroSerie.toLowerCase().includes(q.toLowerCase()))) return false;
    if(categoria && e.categoria !== categoria) return false;
    if(estado && e.estado !== estado) return false;
    if(riesgo && e.riesgo !== riesgo) return false;
    return true;
  }), [equipos, q, categoria, estado, riesgo]);

  return (
    <>
      <div className="toolbar">
        <input type="text" placeholder="Buscar por nombre, serie o inventario..." style={{minWidth:260}} value={q} onChange={e=>setQ(e.target.value)} />
        <select value={categoria} onChange={e=>setCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={estado} onChange={e=>setEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADOS.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={riesgo} onChange={e=>setRiesgo(e.target.value)}>
          <option value="">Toda clasificación</option>
          {RIESGOS.map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="spacer"></div>
        <button className="btn btn-ghost" onClick={()=>openModal('scanner')}>▦ Escanear código QR</button>
        <button className="btn btn-amber" onClick={()=>openModal('equipoForm')}>+ Nuevo equipo</button>
      </div>

      {list.length===0 ? (
        <div className="empty-state"><div className="ic">🔍</div>No se encontraron equipos con esos filtros.</div>
      ) : (
        <div className="equip-grid">
          {list.map(e => {
            const eb = estadoBadge(e.estado);
            return (
              <div className="equip-card" key={e.id} onClick={()=>openModal('equipoDetail', {equipoId:e.id})}>
                <div className="top">
                  <div><h4>{e.nombre}</h4><div className="inv mono">{e.numeroInventario}</div></div>
                  <span className={`badge ${eb.cls}`}><span className="dot"></span>{e.estado}</span>
                </div>
                <div className="info-item"><div className="k">Marca / Modelo</div><div className="v">{e.marca} · {e.modelo}</div></div>
                <div className="meta">
                  <span>{e.categoria}</span><span>{e.riesgo}</span><span>{e.ubicacion}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
