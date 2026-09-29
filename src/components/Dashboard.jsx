import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../context/AppContext.jsx';
import { ESTADOS, CATEGORIAS, daysUntil, dueBadge, fmt } from '../data/mockData.js';

const ESTADO_COLORS = ['#2E9E6D','#D6A32B','#D8433D','#9AA7A5','#147D8C'];

function StatCard({label, value, color, sub}){
  return (
    <div className="card stat-card">
      <span className="tag" style={{background:color}}></span>
      <div className="lbl">{label}</div>
      <div className="val">{value}</div>
      <div className="sub">{sub}</div>
    </div>
  );
}

export default function Dashboard(){
  const { equipos, ordenes, openModal } = useApp();

  const total = equipos.length;
  const operativos = equipos.filter(e=>e.estado==='Operativo').length;
  const fueraServicio = equipos.filter(e=>e.estado==='Fuera de Servicio').length;
  const conOtAbierta = new Set(ordenes.filter(o=>o.estado==='Pendiente'||o.estado==='En progreso').map(o=>o.equipoId)).size;

  const estadoData = ESTADOS.map(s => ({ name:s, value: equipos.filter(e=>e.estado===s).length }));
  const categoriaData = CATEGORIAS.map(c => ({ name:c, value: equipos.filter(e=>e.categoria===c).length }));

  const alerts = equipos
    .map(e => ({ e, dc: daysUntil(e.proximaCalibracion), dm: daysUntil(e.proximoMantenimiento) }))
    .filter(x => (x.dc!==null && x.dc<=30) || (x.dm!==null && x.dm<=30))
    .sort((a,b) => Math.min(a.dc??999, a.dm??999) - Math.min(b.dc??999, b.dm??999));

  return (
    <>
      <div className="grid cards-4">
        <StatCard label="Total de equipos" value={total} color="var(--teal-600)" sub={`${total} registrados en el sistema`} />
        <StatCard label="Operativos" value={operativos} color="var(--ok)" sub={`${total? Math.round(operativos/total*100):0}% del total`} />
        <StatCard label="Fuera de servicio" value={fueraServicio} color="var(--risk)" sub="Requieren atención inmediata" />
        <StatCard label="Con OT abierta" value={conOtAbierta} color="var(--amber)" sub="Órdenes pendientes o en progreso" />
      </div>

      <div className="grid cards-2" style={{marginTop:16}}>
        <div className="card">
          <h3 style={{fontSize:14.5, marginBottom:14}}>Distribución de equipos por estado</h3>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={estadoData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {estadoData.map((entry, i) => <Cell key={entry.name} fill={ESTADO_COLORS[i % ESTADO_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{fontSize:11}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h3 style={{fontSize:14.5, marginBottom:14}}>Equipos por categoría</h3>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoriaData}>
                <XAxis dataKey="name" tick={{fontSize:10}} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} tick={{fontSize:11}} />
                <Tooltip />
                <Bar dataKey="value" fill="#0B4F5C" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="section-title"><h3>Alertas próximas a vencer</h3><span className="hint">Calibración o mantenimiento en ≤ 30 días</span></div>
      <div className="table-wrap">
        {alerts.length===0 ? (
          <div className="empty-state"><div className="ic">✓</div>Sin alertas próximas. Todo el parque de equipos está al día.</div>
        ) : (
          <table>
            <thead><tr><th>Equipo</th><th>Inventario</th><th>Ubicación</th><th>Calibración</th><th>Mantenimiento</th></tr></thead>
            <tbody>
              {alerts.map(({e, dc, dm}) => {
                const bc = dueBadge(dc), bm = dueBadge(dm);
                return (
                  <tr className="row-click" key={e.id} onClick={()=>openModal('equipoDetail', {equipoId:e.id})}>
                    <td><strong>{e.nombre}</strong></td>
                    <td className="mono">{e.numeroInventario}</td>
                    <td>{e.ubicacion}</td>
                    <td><span className={`badge ${bc.cls}`}><span className="dot"></span>{bc.label}</span></td>
                    <td><span className={`badge ${bm.cls}`}><span className="dot"></span>{bm.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
