import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { OT_ESTADOS, prioridadBadgeCls, prioridadColor } from '../data/mockData.js';

export default function Kanban(){
  const { ordenes, equipos, updateOrden, openModal } = useApp();
  const [dragOverCol, setDragOverCol] = useState(null);
  const equipoNombre = id => equipos.find(e=>e.id===id)?.nombre || '—';

  function onDrop(e, estado){
    e.preventDefault();
    setDragOverCol(null);
    const id = e.dataTransfer.getData('text/plain');
    if(id) updateOrden(id, { estado });
  }

  return (
    <div className="kanban-wrap">
      {OT_ESTADOS.map(estado => {
        const items = ordenes.filter(o => o.estado === estado);
        return (
          <div
            key={estado}
            className={`kanban-col ${dragOverCol===estado ? 'drag-over' : ''}`}
            onDragOver={e=>{ e.preventDefault(); setDragOverCol(estado); }}
            onDragLeave={()=>setDragOverCol(null)}
            onDrop={e=>onDrop(e, estado)}
          >
            <h4>{estado} <span className="count">{items.length}</span></h4>
            {items.map(o => (
              <div
                key={o.id}
                className="kcard"
                draggable
                onDragStart={e=>e.dataTransfer.setData('text/plain', o.id)}
                style={{borderLeftColor: prioridadColor(o.prioridad)}}
                onClick={()=>openModal('ordenDetail', {ordenId:o.id})}
              >
                <div className="t">{o.titulo}</div>
                <div className="m">{equipoNombre(o.equipoId)}</div>
                <div className="tags">
                  <span className={`badge ${prioridadBadgeCls(o.prioridad)}`}><span className="dot" style={{background:prioridadColor(o.prioridad)}}></span>{o.prioridad}</span>
                  <span className="badge badge-neutral">{o.tipo}</span>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
