import React, { useState } from 'react';
import Modal from '../Modal.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { CATEGORIAS, ESTADOS, RIESGOS, DEPARTAMENTOS } from '../../data/mockData.js';

const BLANK = {
  nombre:'', numeroSerie:'', numeroInventario:'', marca:'', modelo:'',
  categoria: CATEGORIAS[0], estado: ESTADOS[0], riesgo: RIESGOS[0],
  ubicacion:'', departamento: DEPARTAMENTOS[0], fechaAdquisicion:'', costoAdquisicion:'',
  vencimientoGarantia:'', contrato:false, contratoEmpresa:'', contratoVencimiento:'',
  ultimaCalibracion:'', proximaCalibracion:'', ultimoMantenimiento:'', proximoMantenimiento:'',
  proveedorNombre:'', proveedorContacto:'', registroSanitario:'', manual:null, foto:null,
};

export default function EquipoFormModal({ equipoId }){
  const { equipos, addEquipo, updateEquipo, closeModal } = useApp();
  const editing = equipoId ? equipos.find(e => e.id === equipoId) : null;
  const [form, setForm] = useState(() => editing ? { ...BLANK, ...editing } : { ...BLANK });

  function set(field, value){ setForm(f => ({ ...f, [field]: value })); }

  function handleManual(e){
    const file = e.target.files[0]; if(!file) return;
    set('manual', { name: file.name });
  }
  function handleFoto(e){
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => set('foto', ev.target.result);
    reader.readAsDataURL(file);
  }

  function save(){
    if(!form.nombre || !form.numeroInventario){ alert('Nombre y número de inventario son obligatorios.'); return; }
    const payload = { ...form, costoAdquisicion: Number(form.costoAdquisicion) || 0 };
    if(editing) updateEquipo(editing.id, payload);
    else addEquipo(payload);
    closeModal();
  }

  return (
    <Modal
      title={editing ? 'Editar equipo' : 'Nuevo equipo'}
      onClose={closeModal}
      large
      footer={<>
        <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
        <button className="btn btn-primary" style={{width:'auto'}} onClick={save}>Guardar equipo</button>
      </>}
    >
      <div className="form-grid">
        <div className="field"><label>Nombre del equipo</label><input value={form.nombre} onChange={e=>set('nombre', e.target.value)} /></div>
        <div className="field"><label>Número de serie</label><input value={form.numeroSerie} onChange={e=>set('numeroSerie', e.target.value)} /></div>
        <div className="field"><label>Número de inventario</label><input placeholder="INV-2024-001" value={form.numeroInventario} onChange={e=>set('numeroInventario', e.target.value)} /></div>
        <div className="field"><label>Marca</label><input value={form.marca} onChange={e=>set('marca', e.target.value)} /></div>
        <div className="field"><label>Modelo</label><input value={form.modelo} onChange={e=>set('modelo', e.target.value)} /></div>
        <div className="field"><label>Categoría</label>
          <select value={form.categoria} onChange={e=>set('categoria', e.target.value)}>{CATEGORIAS.map(c=><option key={c}>{c}</option>)}</select>
        </div>
        <div className="field"><label>Estado</label>
          <select value={form.estado} onChange={e=>set('estado', e.target.value)}>{ESTADOS.map(c=><option key={c}>{c}</option>)}</select>
        </div>
        <div className="field"><label>Clasificación de riesgo</label>
          <select value={form.riesgo} onChange={e=>set('riesgo', e.target.value)}>{RIESGOS.map(c=><option key={c}>{c}</option>)}</select>
        </div>
        <div className="field"><label>Ubicación</label><input placeholder="Piso 3, Sala 201" value={form.ubicacion} onChange={e=>set('ubicacion', e.target.value)} /></div>
        <div className="field"><label>Departamento</label>
          <select value={form.departamento} onChange={e=>set('departamento', e.target.value)}>{DEPARTAMENTOS.map(c=><option key={c}>{c}</option>)}</select>
        </div>
        <div className="field"><label>Fecha de adquisición</label><input type="date" value={form.fechaAdquisicion} onChange={e=>set('fechaAdquisicion', e.target.value)} /></div>
        <div className="field"><label>Costo de adquisición</label><input type="number" value={form.costoAdquisicion} onChange={e=>set('costoAdquisicion', e.target.value)} /></div>
        <div className="field"><label>Vencimiento de garantía</label><input type="date" value={form.vencimientoGarantia} onChange={e=>set('vencimientoGarantia', e.target.value)} /></div>

        <div className="field">
          <label>Contrato de mantenimiento</label>
          <div className="radio-row">
            <label><input type="radio" name="contrato" checked={form.contrato===true} onChange={()=>set('contrato', true)} /> Sí</label>
            <label><input type="radio" name="contrato" checked={form.contrato===false} onChange={()=>set('contrato', false)} /> No</label>
          </div>
        </div>
        {form.contrato && (
          <div className="conditional-box">
            <div className="field full" style={{gridColumn:'1/-1'}}><label>Empresa y número de contrato</label><input placeholder="Empresa — N.° de contrato" value={form.contratoEmpresa} onChange={e=>set('contratoEmpresa', e.target.value)} /></div>
            <div className="field full" style={{gridColumn:'1/-1'}}><label>Fecha de vencimiento del contrato</label><input type="date" value={form.contratoVencimiento} onChange={e=>set('contratoVencimiento', e.target.value)} /></div>
          </div>
        )}

        <div className="field"><label>Fecha de última calibración</label><input type="date" value={form.ultimaCalibracion} onChange={e=>set('ultimaCalibracion', e.target.value)} /></div>
        <div className="field"><label>Fecha de próxima calibración</label><input type="date" value={form.proximaCalibracion} onChange={e=>set('proximaCalibracion', e.target.value)} /></div>
        <div className="field"><label>Fecha de último mantenimiento</label><input type="date" value={form.ultimoMantenimiento} onChange={e=>set('ultimoMantenimiento', e.target.value)} /></div>
        <div className="field"><label>Fecha de próximo mantenimiento</label><input type="date" value={form.proximoMantenimiento} onChange={e=>set('proximoMantenimiento', e.target.value)} /></div>
        <div className="field"><label>Nombre del proveedor</label><input value={form.proveedorNombre} onChange={e=>set('proveedorNombre', e.target.value)} /></div>
        <div className="field"><label>Número / correo del proveedor</label><input value={form.proveedorContacto} onChange={e=>set('proveedorContacto', e.target.value)} /></div>
        <div className="field full"><label>Registro INVIMA / Sanitario</label><input value={form.registroSanitario} onChange={e=>set('registroSanitario', e.target.value)} /></div>

        <div className="field">
          <label>Manual de usuario (PDF)</label>
          <label className="file-drop" style={{display:'block'}}>📄 Haz clic para adjuntar PDF
            <input type="file" accept="application/pdf" style={{display:'none'}} onChange={handleManual} />
          </label>
          {form.manual && <div className="file-preview">📎 {form.manual.name}</div>}
        </div>
        <div className="field">
          <label>Registro fotográfico</label>
          <label className="file-drop" style={{display:'block'}}>🖼️ Haz clic para subir foto
            <input type="file" accept="image/*" style={{display:'none'}} onChange={handleFoto} />
          </label>
          {form.foto && <img src={form.foto} className="photo-preview" alt="Equipo" />}
        </div>
      </div>
    </Modal>
  );
}
