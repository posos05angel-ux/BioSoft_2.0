import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const PLANS = [
  { name:'BioSoft Free', limit:'Hasta 3 equipos', desc:'Pruebas de concepto, demostraciones o consultorios pequeños.' },
  { name:'BioSoft Lab', limit:'Hasta 50 equipos', desc:'Laboratorios clínicos y centros de diagnóstico.' },
  { name:'BioSoft Clinic', limit:'Hasta 200 equipos', desc:'Clínicas ambulatorias y centros médicos medianos.' },
  { name:'BioSoft Hospital', limit:'Hasta 800 equipos', desc:'Hospitales generales e instituciones de mediana complejidad.', highlight:true },
  { name:'BioSoft Pro', limit:'Hasta 2,500 equipos', desc:'Hospitales de alta especialidad y centros médicos de gran tamaño.' },
  { name:'BioSoft Network', limit:'Equipos ilimitados (+2,500)', desc:'Redes de hospitales, consorcios y grupos de instituciones bajo una misma administración.' },
];

export default function Login(){
  const { login } = useApp();
  const [mode, setMode] = useState('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [regHospital, setRegHospital] = useState('');
  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');

  function handleLogin(e){
    e.preventDefault();
    const email = loginEmail || 'director@hospital.com';
    const name = email.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g, c=>c.toUpperCase());
    login(name, 'Dirección de Ingeniería Biomédica');
  }

  function handleRegister(e){
    e.preventDefault();
    const hospital = regHospital || 'Tu institución';
    const nombre = regNombre || 'Nuevo usuario';
    alert(`Cuenta creada para ${hospital}. ¡Bienvenido(a) a BioSoft, ${nombre}!`);
    login(nombre, hospital);
  }

  return (
    <div className="login-screen">
      <div className="login-marketing">
        <div className="brand-mark"><span className="dot"></span><span>BIOSOFT</span></div>

        <div className="nameplate">
          <span className="rivet tl"></span><span className="rivet tr"></span><span className="rivet bl"></span><span className="rivet br"></span>
          <div className="eyebrow-tag">● Sistema certificado de gestión biomédica</div>
          <h1>El mantenimiento de tu equipo médico, <em>fuera del Excel.</em></h1>
          <p className="lede">BioSoft es el CMMS diseñado para hospitales, clínicas y laboratorios: controla inventario, calibraciones, mantenimientos y órdenes de trabajo en un solo lugar — con trazabilidad completa y alertas automáticas.</p>

          <div className="benefit-strip">
            <div className="benefit"><div className="num">01</div><h4>Cero calibraciones vencidas</h4><p>Alertas automáticas antes de que venza una calibración, mantenimiento o contrato.</p></div>
            <div className="benefit"><div className="num">02</div><h4>Trazabilidad total</h4><p>Historial completo por equipo: hojas de vida digitales listas para auditoría e INVIMA.</p></div>
            <div className="benefit"><div className="num">03</div><h4>Órdenes de trabajo en segundos</h4><p>Asigna técnicos, notifica por correo y da seguimiento visual con tablero Kanban.</p></div>
            <div className="benefit"><div className="num">04</div><h4>Decisiones con datos</h4><p>Panel de analítica para dirección: estado del parque de equipos en tiempo real.</p></div>
          </div>
        </div>

        <div className="readout-strip">
          <div className="readout"><span className="val">-63%</span><span className="lbl">Tiempo de inactividad de equipos</span></div>
          <div className="readout"><span className="val">100%</span><span className="lbl">Cumplimiento normativo</span></div>
          <div className="readout"><span className="val">&lt;5s</span><span className="lbl">Para consultar hoja de vida</span></div>
        </div>

        <div className="plans-section">
          <div className="plans-head">
            <h3>Un plan para cada tamaño de institución</h3>
            <p>Todos incluyen mantenimiento, calibración, órdenes de trabajo y alertas automáticas.</p>
          </div>
          <div className="plans-grid">
            {PLANS.map(p => (
              <div className={`plan-card ${p.highlight ? 'highlight' : ''}`} key={p.name}>
                {p.highlight && <span className="plan-badge">Más elegido</span>}
                <div className="plan-name">{p.name}</div>
                <div className="plan-limit">{p.limit}</div>
                <div className="plan-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="login-panel">
        {mode === 'login' ? (
          <div className="login-card">
            <div className="brand-mark"><span className="dot"></span><span>BIOSOFT</span></div>
            <h2>Inicia sesión</h2>
            <p className="sub">Accede al panel de gestión de tu institución.</p>
            <form onSubmit={handleLogin} noValidate>
              <div className="field">
                <label>Correo institucional</label>
                <input type="text" placeholder="director@hospitalcentral.com" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} />
              </div>
              <div className="field">
                <label>Contraseña</label>
                <input type="password" placeholder="••••••••" value={loginPass} onChange={e=>setLoginPass(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary">Iniciar sesión</button>
            </form>
            <div className="login-hint">Demo: ingresa cualquier correo y contraseña para entrar a la plataforma.</div>
            <p className="login-foot">¿Nuevo en BioSoft? <a href="#" onClick={e=>{e.preventDefault(); setMode('register');}} style={{color:'var(--teal-600)', fontWeight:600}}>Regístrate aquí</a></p>
          </div>
        ) : (
          <div className="login-card">
            <div className="brand-mark"><span className="dot"></span><span>BIOSOFT</span></div>
            <h2>Crea tu cuenta</h2>
            <p className="sub">Registra tu institución y solicita acceso a BioSoft.</p>
            <form onSubmit={handleRegister} noValidate>
              <div className="field">
                <label>Nombre del hospital / institución</label>
                <input type="text" placeholder="Hospital Central" value={regHospital} onChange={e=>setRegHospital(e.target.value)} />
              </div>
              <div className="field">
                <label>Nombre de quien solicita el servicio</label>
                <input type="text" placeholder="Nombre y apellido" value={regNombre} onChange={e=>setRegNombre(e.target.value)} />
              </div>
              <div className="field">
                <label>Correo</label>
                <input type="text" placeholder="nombre@hospital.com" value={regEmail} onChange={e=>setRegEmail(e.target.value)} />
              </div>
              <div className="field">
                <label>Contraseña</label>
                <input type="password" placeholder="••••••••" value={regPass} onChange={e=>setRegPass(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-amber" style={{width:'100%', padding:'12px'}}>Crear cuenta</button>
            </form>
            <div className="login-hint">Al registrarte, un asesor de BioSoft se pondrá en contacto para activar tu plan.</div>
            <p className="login-foot">¿Ya tienes cuenta? <a href="#" onClick={e=>{e.preventDefault(); setMode('login');}} style={{color:'var(--teal-600)', fontWeight:600}}>Inicia sesión</a></p>
          </div>
        )}
      </div>
    </div>
  );
}
