import React from 'react';
import { useApp } from './context/AppContext.jsx';
import { MODULES } from './data/moduleConfig.js';
import Login from './components/Login.jsx';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import Dashboard from './components/Dashboard.jsx';
import Equipos from './components/Equipos.jsx';
import Ordenes from './components/Ordenes.jsx';
import Kanban from './components/Kanban.jsx';
import Analitica from './components/Analitica.jsx';
import Historial from './components/Historial.jsx';
import Calendario from './components/Calendario.jsx';
import GenericModule from './components/GenericModule.jsx';

import EquipoFormModal from './components/modals/EquipoFormModal.jsx';
import EquipoDetailModal from './components/modals/EquipoDetailModal.jsx';
import QrModal from './components/modals/QrModal.jsx';
import ScannerModal from './components/modals/ScannerModal.jsx';
import OrdenFormModal from './components/modals/OrdenFormModal.jsx';
import OrdenDetailModal from './components/modals/OrdenDetailModal.jsx';

const CORE_VIEWS = { dashboard: Dashboard, equipos: Equipos, ordenes: Ordenes, kanban: Kanban, analitica: Analitica, historial: Historial, calendario: Calendario };

export default function App(){
  const { user, view, modal } = useApp();

  if(!user) return <Login />;

  let ViewBody;
  if(CORE_VIEWS[view]){
    const CoreComponent = CORE_VIEWS[view];
    ViewBody = <CoreComponent />;
  } else if(MODULES[view]){
    // Any of the 12 extra modules (cuasifallas, refacciones, planes de mantenimiento, etc.)
    // render through the same generic list+form component, driven by moduleConfig.js.
    ViewBody = <GenericModule moduleKey={view} />;
  } else {
    ViewBody = <Dashboard />;
  }

  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <Topbar />
        <div className="content">
          {ViewBody}
        </div>
      </main>

      {modal?.type === 'equipoForm' && <EquipoFormModal {...modal.props} />}
      {modal?.type === 'equipoDetail' && <EquipoDetailModal {...modal.props} />}
      {modal?.type === 'qr' && <QrModal {...modal.props} />}
      {modal?.type === 'scanner' && <ScannerModal {...modal.props} />}
      {modal?.type === 'ordenForm' && <OrdenFormModal {...modal.props} />}
      {modal?.type === 'ordenDetail' && <OrdenDetailModal {...modal.props} />}
    </div>
  );
}
