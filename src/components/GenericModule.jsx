import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { useApp } from '../context/AppContext.jsx';
import { MODULES } from '../data/moduleConfig.js';
import { fmt } from '../data/mockData.js';

function displayValue(field, rawValue){
  if(rawValue === undefined || rawValue === null || rawValue === '') return '—';
  if(field.type === 'date') return fmt(rawValue);
  return String(rawValue);
}

function blankForm(fields){
  const obj = {};
  fields.forEach(f => { obj[f.key] = f.type === 'select' ? (f.options?.[0] || '') : ''; });
  return obj;
}

function ItemFormModal({ moduleKey, config, itemId, onClose }){
  const { moduleData, addModuleItem, updateModuleItem } = useApp();
  const editing = itemId ? moduleData[moduleKey].find(i => i.id === itemId) : null;
  const [form, setForm] = useState(() => editing ? { ...blankForm(config.fields), ...editing } : blankForm(config.fields));

  function set(key, value){ setForm(f => ({ ...f, [key]: value })); }

  function save(){
    const requiredField = config.fields[0];
    if(!form[requiredField.key] || !String(form[requiredField.key]).trim()){
      alert(`El campo "${requiredField.label}" es obligatorio.`);
      return;
    }
    if(editing) updateModuleItem(moduleKey, editing.id, form);
    else addModuleItem(moduleKey, form);
    onClose();
  }

  return (
    <Modal
      title={editing ? `Editar — ${config.label}` : `Nuevo registro — ${config.label}`}
      onClose={onClose}
      large
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" style={{width:'auto'}} onClick={save}>Guardar</button>
      </>}
    >
      <div className="form-grid">
        {config.fields.map(f => (
          <div className={`field ${f.type === 'textarea' ? 'full' : ''}`} key={f.key}>
            <label>{f.label}</label>
            {f.type === 'select' ? (
              <select value={form[f.key] ?? ''} onChange={e=>set(f.key, e.target.value)}>
                {f.options.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea rows={3} value={form[f.key] ?? ''} onChange={e=>set(f.key, e.target.value)} />
            ) : (
              <input
                type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                value={form[f.key] ?? ''}
                onChange={e=>set(f.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default function GenericModule({ moduleKey }){
  const config = MODULES[moduleKey];
  const { moduleData, deleteModuleItem } = useApp();
  const items = moduleData[moduleKey] || [];
  const [formOpenFor, setFormOpenFor] = useState(null); // null | 'new' | itemId
  const [q, setQ] = useState('');

  const columnFields = config.columns.map(key => config.fields.find(f => f.key === key)).filter(Boolean);

  const filtered = q.trim()
    ? items.filter(item => columnFields.some(f => String(item[f.key] ?? '').toLowerCase().includes(q.toLowerCase())))
    : items;

  function handleDelete(id){
    if(!confirm('¿Eliminar este registro? Esta acción no se puede deshacer.')) return;
    deleteModuleItem(moduleKey, id);
  }

  return (
    <>
      <p className="module-desc">{config.description}</p>

      <div className="toolbar">
        <input type="text" placeholder="Buscar..." style={{minWidth:240}} value={q} onChange={e=>setQ(e.target.value)} />
        <div className="spacer"></div>
        <button className="btn btn-amber" onClick={()=>setFormOpenFor('new')}>+ Nuevo registro</button>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="ic">{config.icon}</div>Aún no hay registros{q ? ' que coincidan con tu búsqueda' : ''}.</div>
        ) : (
          <table>
            <thead>
              <tr>
                {columnFields.map(f => <th key={f.key}>{f.label}</th>)}
                <th style={{width:90}}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr className="row-click" key={item.id} onClick={()=>setFormOpenFor(item.id)}>
                  {columnFields.map(f => <td key={f.key}>{displayValue(f, item[f.key])}</td>)}
                  <td onClick={e=>e.stopPropagation()}>
                    <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(item.id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {formOpenFor && (
        <ItemFormModal
          moduleKey={moduleKey}
          config={config}
          itemId={formOpenFor === 'new' ? null : formOpenFor}
          onClose={()=>setFormOpenFor(null)}
        />
      )}
    </>
  );
}
