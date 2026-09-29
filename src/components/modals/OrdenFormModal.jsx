import React, { useState } from 'react';
import Modal from '../Modal.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { OT_TIPOS, OT_PRIORIDADES, OT_ESTADOS } from '../../data/mockData.js';

const BLANK = {
  titulo:'', equipoId:'', tipo: OT_TIPOS[0], prioridad:'Media', estado:'Pendiente',
  tecnico:'', correoTecnico:'', fechaProgramada:'', descripcion:'', fotoAntes:null, fotoDespues:null,
};

export default function OrdenFormModal({ ordenId }){
  const { equipos, ordenes, addOrden, updateOrden, closeModal } = useApp();
  const editing = ordenId ? ordenes.find(o => o.id === ordenId) : null;
  const [form, setForm] = useState(() => editing ? { ...BLANK, ...editing } : { ...BLANK });

  function set(field, value){ setForm(f => ({ ...f, [field]: value })); }

  function handleEquipoChange(id){
    setForm(f => ({ ...f, equipoId: id }));
  }

  function handlePhoto(field, e){
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => set(field, ev.target.result);
    reader.readAsDataURL(file);
  }

  function save(){
    if(!form.titulo){ alert('El título es obligatorio.'); return; }
    if(!form.equipoId){ alert('Selecciona un equipo para la orden de trabajo.'); return; }
    if(editing) updateOrden(editing.id, form);
    else {
      addOrden(form);
      alert(`Se enviará una notificación por correo a ${form.correoTecnico || 'el técnico asignado'} sobre esta nueva orden de trabajo.`);
    }
    closeModal();
  }

  const ubicacion = equipos.find(e => e.id === form.equipoId)?.ubicacion || '';

  return (
    <Modal
      title={editing ? 'Editar orden de trabajo' : 'Nueva orden de trabajo'}
      onClose={closeModal}
      large
      footer={<>
        <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
        <button className="btn btn-primary" style={{width:'auto'}} onClick={save}>Guardar orden</button>
      </>}
    >
      <div className="form-grid">
        <div className="field full"><label>Título de la orden de trabajo</label><input value={form.titulo} onChange={e=>set('titulo', e.target.value)} /></div>
        <div className="field">
          <label>Equipo</label>
          <select value={form.equipoId} onChange={e=>handleEquipoChange(e.target.value)}>
            <option value="">Selecciona un equipo</option>
            {equipos.map(e => <option key={e.id} value={e.id}>{e.nombre} ({e.numeroInventario})</option>)}
          </select>
        </div>
        <div className="field"><label>Ubicación del equipo</label><input readOnly value={ubicacion} style={{background:'var(--line-soft)'}} /></div>
        <div className="field"><label>Tipo</label><select value={form.tipo} onChange={e=>set('tipo', e.target.value)}>{OT_TIPOS.map(c=><option key={c}>{c}</option>)}</select></div>
        <div className="field"><label>Prioridad</label><select value={form.prioridad} onChange={e=>set('prioridad', e.target.value)}>{OT_PRIORIDADES.map(c=><option key={c}>{c}</option>)}</select></div>
        <div className="field"><label>Estado</label><select value={form.estado} onChange={e=>set('estado', e.target.value)}>{OT_ESTADOS.map(c=><option key={c}>{c}</option>)}</select></div>
        <div className="field"><label>Técnico asignado</label><input value={form.tecnico} onChange={e=>set('tecnico', e.target.value)} /></div>
        <div className="field"><label>Correo del técnico</label><input type="email" value={form.correoTecnico} onChange={e=>set('correoTecnico', e.target.value)} /></div>
        <div className="field"><label>Fecha programada</label><input type="date" value={form.fechaProgramada} onChange={e=>set('fechaProgramada', e.target.value)} /></div>
        <div className="field full"><label>Descripción</label><textarea rows={3} value={form.descripcion} onChange={e=>set('descripcion', e.target.value)} /></div>
        <div className="field">
          <label>Registro fotográfico — antes</label>
          <label className="file-drop" style={{display:'block'}}>🖼️ Subir foto (antes)
            <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>handlePhoto('fotoAntes', e)} />
          </label>
          {form.fotoAntes && <img src={form.fotoAntes} className="photo-preview" alt="Antes" />}
        </div>
        <div className="field">
          <label>Registro fotográfico — después</label>
          <label className="file-drop" style={{display:'block'}}>🖼️ Subir foto (después)
            <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>handlePhoto('fotoDespues', e)} />
          </label>
          {form.fotoDespues && <img src={form.fotoDespues} className="photo-preview" alt="Después" />}
        </div>
      </div>
    </Modal>
  );
}
