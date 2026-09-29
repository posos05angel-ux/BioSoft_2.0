import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { MESES, TODAY, iso, fmt } from '../data/mockData.js';

const CAL_COLORS = { cal:'var(--teal-600)', man:'var(--warn)', ctr:'var(--amber)', ot:'var(--risk)' };
const CAL_LABELS = { cal:'Calibración', man:'Mantenimiento', ctr:'Vencimiento de contrato', ot:'Orden de trabajo' };
const DOW = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

export default function Calendario(){
  const { equipos, ordenes } = useApp();
  const [year, setYear] = useState(TODAY.getFullYear());
  const [month, setMonth] = useState(TODAY.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  const events = useMemo(() => {
    const list = [];
    equipos.forEach(e => {
      if(e.proximaCalibracion) list.push({ date:e.proximaCalibracion, label:`Calibración — ${e.nombre}`, type:'cal' });
      if(e.proximoMantenimiento) list.push({ date:e.proximoMantenimiento, label:`Mantenimiento — ${e.nombre}`, type:'man' });
      if(e.contrato && e.contratoVencimiento) list.push({ date:e.contratoVencimiento, label:`Vence contrato — ${e.nombre}`, type:'ctr' });
    });
    ordenes.forEach(o => { if(o.fechaProgramada) list.push({ date:o.fechaProgramada, label:`OT: ${o.titulo}`, type:'ot' }); });
    return list;
  }, [equipos, ordenes]);

  function nav(delta){
    let m = month + delta, y = year;
    if(m < 0){ m = 11; y--; } if(m > 11){ m = 0; y++; }
    setMonth(m); setYear(y); setSelectedDay(null);
  }
  function today(){ setYear(TODAY.getFullYear()); setMonth(TODAY.getMonth()); setSelectedDay(null); }

  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  let cells = [];
  for(let i=startWeekday-1;i>=0;i--) cells.push({ day: daysInPrevMonth-i, muted:true });
  for(let d=1; d<=daysInMonth; d++) cells.push({ day:d, muted:false, dateObj:new Date(year,month,d) });
  while(cells.length % 7 !== 0) cells.push({ day: cells.length, muted:true });

  const dayEvents = selectedDay ? events.filter(ev => ev.date === selectedDay) : [];

  return (
    <div className="card">
      <div className="cal-head">
        <h3>{MESES[month]} {year}</h3>
        <div className="cal-nav">
          <button className="btn btn-ghost btn-sm" onClick={()=>nav(-1)}>‹ Anterior</button>
          <button className="btn btn-ghost btn-sm" onClick={today}>Hoy</button>
          <button className="btn btn-ghost btn-sm" onClick={()=>nav(1)}>Siguiente ›</button>
        </div>
      </div>
      <div className="cal-grid">
        {DOW.map(d => <div className="cal-dow" key={d}>{d}</div>)}
        {cells.map((c, i) => {
          if(c.muted) return <div className="cal-day muted" key={i}><div className="dnum">{c.day}</div></div>;
          const dayIso = iso(c.dateObj);
          const evs = events.filter(ev => ev.date === dayIso);
          const isToday = dayIso === iso(TODAY);
          return (
            <div key={i} className={`cal-day ${isToday ? 'today' : ''}`} onClick={()=>setSelectedDay(dayIso)}>
              <div className="dnum">{c.day}</div>
              <div>{evs.slice(0,4).map((ev,j) => <span key={j} className="cal-dot" style={{background: CAL_COLORS[ev.type]}} title={ev.label}></span>)}</div>
            </div>
          );
        })}
      </div>
      <div className="cal-legend">
        {Object.keys(CAL_LABELS).map(k => <span key={k}><span className="cal-dot" style={{background:CAL_COLORS[k]}}></span>{CAL_LABELS[k]}</span>)}
      </div>
      <div className="cal-events-panel">
        {selectedDay && (
          <>
            <div className="section-title"><h3>Eventos — {fmt(selectedDay)}</h3></div>
            {dayEvents.length === 0 ? (
              <div className="empty-state" style={{padding:24}}>Sin eventos este día.</div>
            ) : dayEvents.map((ev, i) => (
              <div className="cal-event-item" key={i}>
                <span className="cal-dot" style={{background:CAL_COLORS[ev.type], marginTop:5}}></span>
                <div><strong>{CAL_LABELS[ev.type]}</strong><div style={{color:'var(--ink-soft)'}}>{ev.label}</div></div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
