import React, { useState } from 'react';
import Modal from '../Modal.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { fmt, money, daysUntil, dueBadge, estadoBadge, prioridadBadgeCls, prioridadColor, estadoOtBadgeCls } from '../../data/mockData.js';

function InfoItem({k, v}){
  return <div className="info-item"><div className="k">{k}</div><div className="v">{v}</div></div>;
}

export default function EquipoDetailModal({ equipoId }){
  const { equipos, ordenes, deleteEquipo, openModal, closeModal } = useApp();
  const [tab, setTab] = useState('info');
  const e = equipos.find(x => x.id === equipoId);
  if(!e) return null;
  const relatedOT = ordenes.filter(o => o.equipoId === equipoId);
  const eb = estadoBadge(e.estado);

  function handleDelete(){
    if(!confirm('¿Eliminar este equipo del inventario? Esta acción no se puede deshacer.')) return;
    deleteEquipo(e.id);
    closeModal();
  }

  const cal = daysUntil(e.proximaCalibracion), man = daysUntil(e.proximoMantenimiento);
  const bcal = dueBadge(cal), bman = dueBadge(man);
  const contratoDays = e.contrato ? daysUntil(e.contratoVencimiento) : null;
  const bctr = e.contrato ? dueBadge(contratoDays) : null;

  return (
    <Modal
      title={e.nombre}
      onClose={closeModal}
      large
    >
      <div className="mono" style={{fontSize:11.5, color:'var(--ink-soft)', marginTop:-14, marginBottom:16}}>{e.numeroInventario} · {e.numeroSerie}</div>

      <div className="detail-actions">
        <span className={`badge ${eb.cls}`} style={{padding:'7px 12px'}}><span className="dot"></span>{e.estado}</span>
        <button className="btn btn-ghost btn-sm" onClick={()=>{ closeModal(); openModal('equipoForm', {equipoId: e.id}); }}>✎ Editar</button>
        <button className="btn btn-ghost btn-sm" onClick={()=>openModal('qr', {equipoId: e.id})}>▦ Código QR</button>
        <button className="btn btn-ghost btn-sm" onClick={()=>exportEquipoPdf(e)}>⭳ Exportar PDF</button>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>🗑 Eliminar</button>
      </div>

      <div className="tabs">
        {[['info','Información'],['maint','Mantenimiento'],['fotos','Fotos'],['ot','Órdenes de Trabajo'],['hist','Historial']].map(([key,label]) => (
          <button key={key} className={`tab-btn ${tab===key?'active':''}`} onClick={()=>setTab(key)}>{label}</button>
        ))}
      </div>

      {tab==='info' && (
        <div className="info-grid">
          <InfoItem k="Marca / Modelo" v={`${e.marca} · ${e.modelo}`} />
          <InfoItem k="Categoría" v={e.categoria} />
          <InfoItem k="Clasificación de riesgo" v={e.riesgo} />
          <InfoItem k="Ubicación" v={e.ubicacion} />
          <InfoItem k="Departamento" v={e.departamento} />
          <InfoItem k="Fecha de adquisición" v={fmt(e.fechaAdquisicion)} />
          <InfoItem k="Costo de adquisición" v={money(e.costoAdquisicion)} />
          <InfoItem k="Vencimiento de garantía" v={fmt(e.vencimientoGarantia)} />
          <InfoItem k="Contrato de mantenimiento" v={e.contrato ? 'Sí' : 'No'} />
          {e.contrato && <InfoItem k="Detalles del contrato" v={`${e.contratoEmpresa||'—'} · vence ${fmt(e.contratoVencimiento)}`} />}
          <InfoItem k="Proveedor" v={e.proveedorNombre || '—'} />
          <InfoItem k="Contacto proveedor" v={e.proveedorContacto || '—'} />
          <InfoItem k="Registro INVIMA/Sanitario" v={e.registroSanitario || '—'} />
          <InfoItem k="Manual de usuario" v={e.manual ? `📎 ${e.manual.name}` : 'No adjunto'} />
        </div>
      )}

      {tab==='maint' && (
        <>
          <div className="maint-row">
            <div><div className="l">Próxima calibración</div><div className="d">Última: {fmt(e.ultimaCalibracion)} → Próxima: {fmt(e.proximaCalibracion)}</div></div>
            <span className={`badge ${bcal.cls}`}><span className="dot"></span>{bcal.label}</span>
          </div>
          <div className="maint-row">
            <div><div className="l">Próximo mantenimiento</div><div className="d">Último: {fmt(e.ultimoMantenimiento)} → Próximo: {fmt(e.proximoMantenimiento)}</div></div>
            <span className={`badge ${bman.cls}`}><span className="dot"></span>{bman.label}</span>
          </div>
          {e.contrato && (
            <div className="maint-row">
              <div><div className="l">Contrato de mantenimiento</div><div className="d">{e.contratoEmpresa}</div></div>
              <span className={`badge ${bctr.cls}`}><span className="dot"></span>{bctr.label}</span>
            </div>
          )}
          {((cal!==null && cal<=30) || (man!==null && man<=30)) && (
            <div className="login-hint" style={{marginTop:14, background:'var(--warn-100)', borderColor:'var(--warn)', color:'#7a5c14'}}>
              ⚠ Se enviará una alerta automática por correo antes del vencimiento de esta fecha.
            </div>
          )}
        </>
      )}

      {tab==='fotos' && (
        e.foto ? <img src={e.foto} style={{maxWidth:'100%', borderRadius:10, border:'1px solid var(--line)'}} alt="Equipo" />
        : <div className="empty-state"><div className="ic">🖼️</div>Sin registro fotográfico adjunto.</div>
      )}

      {tab==='ot' && (
        relatedOT.length===0 ? <div className="empty-state"><div className="ic">🛠</div>Este equipo no tiene órdenes de trabajo registradas.</div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Título</th><th>Tipo</th><th>Prioridad</th><th>Estado</th><th>Fecha</th></tr></thead>
              <tbody>
                {relatedOT.map(o => (
                  <tr className="row-click" key={o.id} onClick={()=>{ closeModal(); openModal('ordenDetail', {ordenId:o.id}); }}>
                    <td>{o.titulo}</td>
                    <td>{o.tipo}</td>
                    <td><span className={`badge ${prioridadBadgeCls(o.prioridad)}`}><span className="dot" style={{background:prioridadColor(o.prioridad)}}></span>{o.prioridad}</span></td>
                    <td><span className={`badge ${estadoOtBadgeCls(o.estado)}`}>{o.estado}</span></td>
                    <td className="mono">{fmt(o.fechaProgramada)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {tab==='hist' && (
        (e.historial||[]).length===0 ? <div className="empty-state"><div className="ic">≡</div>Sin eventos registrados en el historial.</div> : (
          <div className="timeline">
            {[...e.historial].sort((a,b)=> new Date(b.fecha)-new Date(a.fecha)).map((h,i) => (
              <div className="tl-item" key={i}>
                <div className="when">{fmt(h.fecha)}</div>
                <div className="what">{h.tipo}</div>
                <div className="who">{h.detalle}</div>
              </div>
            ))}
          </div>
        )
      )}
    </Modal>
  );
}

function exportEquipoPdf(e){
  import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF();
    let y = 18;
    doc.setFontSize(16); doc.text('BioSoft — Hoja de vida del equipo', 14, y); y += 10;
    doc.setFontSize(11);
    const lines = [
      ['Nombre', e.nombre], ['Número de serie', e.numeroSerie], ['Número de inventario', e.numeroInventario],
      ['Marca', e.marca], ['Modelo', e.modelo], ['Categoría', e.categoria], ['Estado', e.estado],
      ['Clasificación de riesgo', e.riesgo], ['Ubicación', e.ubicacion], ['Departamento', e.departamento],
      ['Fecha de adquisición', fmt(e.fechaAdquisicion)], ['Costo de adquisición', money(e.costoAdquisicion)],
      ['Vencimiento de garantía', fmt(e.vencimientoGarantia)],
      ['Contrato de mantenimiento', e.contrato ? `Sí — ${e.contratoEmpresa||''} (vence ${fmt(e.contratoVencimiento)})` : 'No'],
      ['Última calibración', fmt(e.ultimaCalibracion)], ['Próxima calibración', fmt(e.proximaCalibracion)],
      ['Último mantenimiento', fmt(e.ultimoMantenimiento)], ['Próximo mantenimiento', fmt(e.proximoMantenimiento)],
      ['Proveedor', e.proveedorNombre], ['Contacto proveedor', e.proveedorContacto],
      ['Registro INVIMA/Sanitario', e.registroSanitario],
    ];
    lines.forEach(([k,v]) => {
      doc.setFont(undefined,'bold'); doc.text(k+':', 14, y);
      doc.setFont(undefined,'normal'); doc.text(String(v||'—'), 80, y);
      y += 8; if(y>270){ doc.addPage(); y=18; }
    });
    doc.save(`Equipo-${e.numeroInventario}.pdf`);
  });
}
