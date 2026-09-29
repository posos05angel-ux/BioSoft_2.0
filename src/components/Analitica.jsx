import React, { useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../context/AppContext.jsx';
import { CATEGORIAS, OT_TIPOS, MESES, TODAY } from '../data/mockData.js';

const TIPO_COLORS = ['#0B4F5C','#147D8C','#E8622C','#D6A32B','#5B9E7C'];

export default function Analitica(){
  const { equipos, ordenes } = useApp();

  const categoriaData = CATEGORIAS.map(c => ({ name:c, value: equipos.filter(e=>e.categoria===c).length }));
  const tipoData = OT_TIPOS.map(t => ({ name:t, value: ordenes.filter(o=>o.tipo===t).length }));

  const mesData = useMemo(() => {
    const months = [];
    for(let i=7;i>=0;i--){
      const d = new Date(TODAY.getFullYear(), TODAY.getMonth()-i, 1);
      months.push({ y:d.getFullYear(), m:d.getMonth() });
    }
    return months.map(mm => ({
      name: `${MESES[mm.m].slice(0,3)} ${String(mm.y).slice(2)}`,
      value: ordenes.filter(o => { const d = new Date(o.fechaProgramada); return d.getFullYear()===mm.y && d.getMonth()===mm.m; }).length,
    }));
  }, [ordenes]);

  return (
    <>
      <div className="grid cards-2">
        <div className="card">
          <h3 style={{fontSize:14.5, marginBottom:14}}>Equipos por categoría</h3>
          <div className="chart-box tall">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoriaData}>
                <XAxis dataKey="name" tick={{fontSize:10}} interval={0} angle={-20} textAnchor="end" height={70} />
                <YAxis allowDecimals={false} tick={{fontSize:11}} />
                <Tooltip />
                <Bar dataKey="value" fill="#147D8C" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h3 style={{fontSize:14.5, marginBottom:14}}>Órdenes por tipo</h3>
          <div className="chart-box tall">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={tipoData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {tipoData.map((entry, i) => <Cell key={entry.name} fill={TIPO_COLORS[i % TIPO_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{fontSize:11}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop:16}}>
        <h3 style={{fontSize:14.5, marginBottom:14}}>Órdenes de trabajo por mes</h3>
        <div className="chart-box tall">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line-soft)" />
              <XAxis dataKey="name" tick={{fontSize:11}} />
              <YAxis allowDecimals={false} tick={{fontSize:11}} />
              <Tooltip />
              <Line type="monotone" dataKey="value" name="Órdenes de trabajo" stroke="#E8622C" strokeWidth={2.5} dot={{fill:'#E8622C'}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
