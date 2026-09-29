import React, { useEffect, useState } from 'react';
import Modal from '../Modal.jsx';
import { useApp } from '../../context/AppContext.jsx';

export default function QrModal({ equipoId }){
  const { equipos, closeModal } = useApp();
  const e = equipos.find(x => x.id === equipoId);
  const [dataUrl, setDataUrl] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if(!e) return;
    let cancelled = false;
    const payload = `BIOSOFT|${e.nombre}|INV:${e.numeroInventario}|SN:${e.numeroSerie}|UBI:${e.ubicacion}`;
    import('qrcode').then(QRCode => {
      QRCode.toDataURL(payload, { width: 220, margin: 1, color: { dark: '#0B4F5C', light: '#FFFFFF' } })
        .then(url => { if(!cancelled) setDataUrl(url); })
        .catch(() => { if(!cancelled) setError(true); });
    }).catch(() => setError(true));
    return () => { cancelled = true; };
  }, [e]);

  if(!e) return null;

  function download(){
    if(!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `QR-${e.numeroInventario}.png`;
    a.click();
  }

  return (
    <Modal
      title="Código QR del equipo"
      onClose={closeModal}
      footer={<>
        <button className="btn btn-ghost" onClick={closeModal}>Cerrar</button>
        <button className="btn btn-primary" style={{width:'auto'}} onClick={download} disabled={!dataUrl}>⭳ Descargar QR</button>
      </>}
    >
      <div style={{textAlign:'center'}}>
        <div className="qr-frame">
          <div style={{display:'flex', justifyContent:'center', marginBottom:12, minHeight:170, alignItems:'center'}}>
            {error && <p style={{color:'var(--risk)', fontSize:12.5}}>No se pudo generar el código QR.</p>}
            {!error && !dataUrl && <p style={{color:'var(--ink-soft)', fontSize:12.5}}>Generando...</p>}
            {dataUrl && <img src={dataUrl} alt="Código QR" width={168} height={168} />}
          </div>
          <div className="mono" style={{fontWeight:600}}>{e.nombre}</div>
          <div className="mono" style={{fontSize:11.5, color:'var(--ink-soft)'}}>{e.numeroInventario} · {e.numeroSerie}</div>
        </div>
        <p style={{fontSize:12.5, color:'var(--ink-soft)', marginTop:14}}>Descarga esta etiqueta e imprímela para pegarla en el equipo.</p>
      </div>
    </Modal>
  );
}
