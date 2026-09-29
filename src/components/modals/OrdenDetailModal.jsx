import React from 'react';
import Modal from '../Modal.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { fmt, prioridadBadgeCls, prioridadColor, estadoOtBadgeCls } from '../../data/mockData.js';

function InfoItem({k, v}){
  return <div className="info-item"><div className="k">{k}</div><div className="v">{v}</div></div>;
}

export default function OrdenDetailModal({ ordenId }){
  const { ordenes, equipos, deleteOrden, openModal, closeModal } = useApp();
  const o = ordenes.find(x => x.id === ordenId);
  if(!o) return null;
  const equipo = equipos.find(e => e.id === o.equipoId);

  function handleDelete(){
    if(!confirm('¿Eliminar esta orden de trabajo?')) return;
    deleteOrden(o.id);
    closeModal();
  }

  function handlePrint(){
    const win = window.open('', '_blank');
    win.document.write(`
      <h2 style="font-family:sans-serif;">BioSoft — Orden de Trabajo</h2>
      <p><strong>Título:</strong> ${o.titulo}</p>
      <p><strong>Equipo:</strong> ${equipo?.nombre || '—'} — ${equipo?.ubicacion || '—'}</p>
      <p><strong>Tipo:</strong> ${o.tipo} | <strong>Prioridad:</strong> ${o.prioridad} | <strong>Estado:</strong> ${o.estado}</p>
      <p><strong>Técnico:</strong> ${o.tecnico} (${o.correoTecnico})</p>
      <p><strong>Fecha programada:</strong> ${fmt(o.fechaProgramada)}</p>
      <p><strong>Descripción:</strong> ${o.descripcion || '—'}</p>
    `);
    win.document.close();
    win.print();
  }

  function handleDownload(){
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      let y = 18;
      doc.setFontSize(16); doc.text('BioSoft — Orden de Trabajo', 14, y); y += 10; doc.setFontSize(11);
      const lines = [
        ['Título', o.titulo], ['Equipo', equipo?.nombre || '—'], ['Ubicación', equipo?.ubicacion || '—'],
        ['Tipo', o.tipo], ['Prioridad', o.prioridad], ['Estado', o.estado], ['Técnico asignado', o.tecnico],
        ['Correo del técnico', o.correoTecnico], ['Fecha programada', fmt(o.fechaProgramada)], ['Descripción', o.descripcion || '—'],
      ];
      lines.forEach(([k,v]) => {
        doc.setFont(undefined,'bold'); doc.text(k+':', 14, y);
        doc.setFont(undefined,'normal');
        const split = doc.splitTextToSize(String(v||'—'), 110); doc.text(split, 70, y);
        y += 8 * Math.max(1, split.length); if(y>270){ doc.addPage(); y=18; }
      });
      doc.save(`OT-${o.id}.pdf`);
    });
  }

  return (
    <Modal title={o.titulo} onClose={closeModal} large>
      <div className="detail-actions">
        <span className={`badge ${prioridadBadgeCls(o.prioridad)}`} style={{padding:'7px 12px'}}><span className="dot" style={{background:prioridadColor(o.prioridad)}}></span>{o.prioridad}</span>
        <span className={`badge ${estadoOtBadgeCls(o.estado)}`} style={{padding:'7px 12px'}}>{o.estado}</span>
        <button className="btn btn-ghost btn-sm" onClick={()=>{ closeModal(); openModal('ordenForm', {ordenId: o.id}); }}>✎ Editar</button>
        <button className="btn btn-ghost btn-sm" onClick={handlePrint}>🖨 Imprimir</button>
        <button className="btn btn-ghost btn-sm" onClick={handleDownload}>⭳ Descargar</button>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>🗑 Eliminar</button>
      </div>

      <div className="info-grid">
        <InfoItem k="Equipo" v={equipo?.nombre || '—'} />
        <InfoItem k="Ubicación" v={equipo?.ubicacion || '—'} />
        <InfoItem k="Tipo" v={o.tipo} />
        <InfoItem k="Técnico asignado" v={o.tecnico} />
        <InfoItem k="Correo del técnico" v={o.correoTecnico} />
        <InfoItem k="Fecha programada" v={fmt(o.fechaProgramada)} />
      </div>

      <div style={{marginTop:16}}>
        <div className="info-item"><div className="k">Descripción</div><div className="v" style={{fontWeight:400}}>{o.descripcion || '—'}</div></div>
      </div>

      <div className="grid cards-2" style={{marginTop:16}}>
        <div>
          <div className="k" style={{fontSize:11, color:'var(--ink-soft)', marginBottom:6}}>Foto antes</div>
          {o.fotoAntes ? <img src={o.fotoAntes} style={{maxWidth:'100%', borderRadius:8, border:'1px solid var(--line)'}} alt="Antes" /> : <div className="empty-state" style={{padding:20}}>Sin foto</div>}
        </div>
        <div>
          <div className="k" style={{fontSize:11, color:'var(--ink-soft)', marginBottom:6}}>Foto después</div>
          {o.fotoDespues ? <img src={o.fotoDespues} style={{maxWidth:'100%', borderRadius:8, border:'1px solid var(--line)'}} alt="Después" /> : <div className="empty-state" style={{padding:20}}>Sin foto</div>}
        </div>
      </div>
    </Modal>
  );
}
