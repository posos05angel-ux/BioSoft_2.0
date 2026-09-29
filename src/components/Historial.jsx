import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { fmt } from '../data/mockData.js';

export default function Historial(){
  const { equipos, ordenes } = useApp();

  const events = useMemo(() => {
    const list = [];
    equipos.forEach(e => {
      (e.historial || []).forEach(h => list.push({ fecha:h.fecha, what:`${h.tipo} — ${e.nombre}`, who:h.detalle, tag:e.numeroInventario }));
    });
    ordenes.filter(o => o.estado === 'Completada').forEach(o => {
      const eq = equipos.find(e => e.id === o.equipoId);
      list.push({ fecha:o.fechaProgramada, what:`OT completada: ${o.titulo}`, who:`Técnico: ${o.tecnico} · ${eq?.nombre || '—'}`, tag:o.tipo });
    });
    return list.sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
  }, [equipos, ordenes]);

  if(events.length === 0) return <div className="empty-state"><div className="ic">≡</div>Aún no hay eventos registrados.</div>;

  return (
    <div className="card">
      <div className="timeline">
        {events.map((ev, i) => (
          <div className="tl-item" key={i}>
            <div className="when">{fmt(ev.fecha)} · <span className="mono">{ev.tag}</span></div>
            <div className="what">{ev.what}</div>
            <div className="who">{ev.who}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
