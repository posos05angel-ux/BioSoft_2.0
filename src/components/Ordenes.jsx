import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { OT_ESTADOS, OT_PRIORIDADES, OT_TIPOS, fmt, prioridadBadgeCls, prioridadColor, estadoOtBadgeCls } from '../data/mockData.js';

export default function Ordenes(){
  const { ordenes, equipos, openModal } = useApp();
  const [q, setQ] = useState('');
  const [estado, setEstado] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [tipo, setTipo] = useState('');

  const equipoNombre = id => equipos.find(e=>e.id===id)?.nombre || '—';

  const list = useMemo(() => ordenes.filter(o => {
    if(q && !o.titulo.toLowerCase().includes(q.toLowerCase())) return false;
    if(estado && o.estado !== estado) return false;
    if(prioridad && o.prioridad !== prioridad) return false;
    if(tipo && o.tipo !== tipo) return false;
    return true;
  }).slice().sort((a,b)=> new Date(a.fechaProgramada) - new Date(b.fechaProgramada)), [ordenes, q, estado, prioridad, tipo]);

  return (
    <>
      <div className="toolbar">
        <input type="text" placeholder="Buscar orden de trabajo..." style={{minWidth:240}} value={q} onChange={e=>setQ(e.target.value)} />
        <select value={estado} onChange={e=>setEstado(e.target.value)}><option value="">Todos los estados</option>{OT_ESTADOS.map(c=><option key={c}>{c}</option>)}</select>
        <select value={prioridad} onChange={e=>setPrioridad(e.target.value)}><option value="">Toda prioridad</option>{OT_PRIORIDADES.map(c=><option key={c}>{c}</option>)}</select>
        <select value={tipo} onChange={e=>setTipo(e.target.value)}><option value="">Todo tipo</option>{OT_TIPOS.map(c=><option key={c}>{c}</option>)}</select>
        <div className="spacer"></div>
        <button className="btn btn-amber" onClick={()=>openModal('ordenForm')}>+ Nueva orden</button>
      </div>

      <div className="table-wrap">
        {list.length===0 ? (
          <div className="empty-state"><div className="ic">🛠</div>No hay órdenes de trabajo con esos filtros.</div>
        ) : (
          <table>
            <thead><tr><th>Título</th><th>Equipo</th><th>Tipo</th><th>Prioridad</th><th>Estado</th><th>Técnico</th><th>Fecha</th></tr></thead>
            <tbody>
              {list.map(o => (
                <tr className="row-click" key={o.id} onClick={()=>openModal('ordenDetail', {ordenId:o.id})}>
                  <td><strong>{o.titulo}</strong></td>
                  <td>{equipoNombre(o.equipoId)}</td>
                  <td>{o.tipo}</td>
                  <td><span className={`badge ${prioridadBadgeCls(o.prioridad)}`}><span className="dot" style={{background:prioridadColor(o.prioridad)}}></span>{o.prioridad}</span></td>
                  <td><span className={`badge ${estadoOtBadgeCls(o.estado)}`}>{o.estado}</span></td>
                  <td>{o.tecnico}</td>
                  <td className="mono">{fmt(o.fechaProgramada)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
