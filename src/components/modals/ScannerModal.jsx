import React, { useEffect, useRef, useState } from 'react';
import Modal from '../Modal.jsx';
import { useApp } from '../../context/AppContext.jsx';

const CAMERA_DIV_ID = 'biosoft-qr-camera';

export default function ScannerModal(){
  const { equipos, closeModal, openModal } = useApp();
  const [cameraStatus, setCameraStatus] = useState('Iniciando cámara…');
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [fileStatus, setFileStatus] = useState('');
  const [query, setQuery] = useState('');
  const scannerRef = useRef(null);

  function resolveAndOpen(text){
    const t = String(text || '');
    const found = equipos.find(eq =>
      t.includes(eq.numeroInventario) ||
      t.toLowerCase() === eq.numeroInventario.toLowerCase() ||
      t.toLowerCase() === eq.numeroSerie.toLowerCase()
    );
    if(!found){ alert('No se encontró ningún equipo registrado que coincida con ese código.'); return; }
    closeModal();
    openModal('equipoDetail', { equipoId: found.id });
  }

  useEffect(() => {
    let cancelled = false;
    import('html5-qrcode').then(({ Html5Qrcode }) => {
      if(cancelled) return;
      const instance = new Html5Qrcode(CAMERA_DIV_ID);
      scannerRef.current = instance;
      Html5Qrcode.getCameras().then(cams => {
        if(cancelled || !cams || cams.length === 0) throw new Error('no-camera');
        return instance.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 220 },
          decodedText => resolveAndOpen(decodedText),
          () => {}
        );
      }).then(() => {
        if(!cancelled) setCameraStatus('Apunta la cámara al código QR del equipo.');
      }).catch(() => {
        if(!cancelled){ setCameraAvailable(false); setCameraStatus('Cámara no disponible en este navegador.'); }
      });
    }).catch(() => {
      setCameraAvailable(false);
      setCameraStatus('Cámara no disponible.');
    });

    return () => {
      cancelled = true;
      if(scannerRef.current){
        scannerRef.current.stop().then(()=> scannerRef.current.clear()).catch(()=>{});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose(){
    if(scannerRef.current){
      scannerRef.current.stop().then(()=> scannerRef.current.clear()).catch(()=>{});
    }
    closeModal();
  }

  async function handleFile(e){
    const file = e.target.files[0]; if(!file) return;
    setFileStatus('Leyendo imagen...');
    try{
      const { Html5Qrcode } = await import('html5-qrcode');
      const tempId = 'biosoft-qr-file-temp';
      let el = document.getElementById(tempId);
      if(!el){ el = document.createElement('div'); el.id = tempId; el.style.display = 'none'; document.body.appendChild(el); }
      const instance = new Html5Qrcode(tempId);
      const result = await instance.scanFile(file, false);
      setFileStatus('Código detectado ✓');
      resolveAndOpen(result);
    }catch(err){
      setFileStatus('No se pudo leer el código en esa imagen. Prueba con la búsqueda manual.');
    }
  }

  const matches = query.trim()
    ? equipos.filter(eq =>
        eq.numeroInventario.toLowerCase().includes(query.toLowerCase()) ||
        eq.numeroSerie.toLowerCase().includes(query.toLowerCase()) ||
        eq.nombre.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <Modal title="Escanear código QR" onClose={handleClose} footer={<button className="btn btn-ghost" onClick={handleClose}>Cerrar</button>}>
      {cameraAvailable && (
        <div>
          <div id={CAMERA_DIV_ID} style={{width:'100%', borderRadius:10, overflow:'hidden', background:'#0E2A32', minHeight: 220}}></div>
          <div style={{fontSize:12, color:'var(--ink-soft)', marginTop:8, textAlign:'center'}}>{cameraStatus}</div>
        </div>
      )}
      {!cameraAvailable && <div style={{fontSize:12, color:'var(--ink-soft)', marginBottom:6}}>{cameraStatus} Usa las opciones de abajo.</div>}

      <div className="section-title" style={{margin:'20px 0 10px'}}><h3>O sube una foto del código</h3></div>
      <label className="file-drop" style={{display:'block'}}>🖼️ Haz clic para subir una imagen del QR
        <input type="file" accept="image/*" style={{display:'none'}} onChange={handleFile} />
      </label>
      {fileStatus && <div style={{fontSize:12, color:'var(--ink-soft)', marginTop:6}}>{fileStatus}</div>}

      <div className="section-title" style={{margin:'20px 0 10px'}}><h3>O busca manualmente</h3></div>
      <input type="text" placeholder="Escribe el número de inventario o serie..." value={query} onChange={e=>setQuery(e.target.value)}
        style={{width:'100%', padding:'10px 12px', border:'1px solid var(--line)', borderRadius:8, fontSize:13}} />
      <div style={{marginTop:10}}>
        {query.trim() && matches.length===0 && <div style={{fontSize:12.5, color:'var(--ink-soft)'}}>Sin coincidencias.</div>}
        {matches.map(eq => (
          <div className="maint-row" key={eq.id} style={{cursor:'pointer', padding:'10px 4px'}} onClick={()=>resolveAndOpen(eq.numeroInventario)}>
            <div><div className="l">{eq.nombre}</div><div className="d">{eq.numeroInventario} · {eq.ubicacion}</div></div>
            <span className="badge badge-teal">Abrir</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
