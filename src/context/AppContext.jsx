import React, { createContext, useContext, useState, useCallback } from 'react';
import { seedEquipos, seedOrdenes, uid } from '../data/mockData.js';
import { MODULES } from '../data/moduleConfig.js';

const AppContext = createContext(null);

function initialModuleData(){
  const data = {};
  Object.entries(MODULES).forEach(([key, cfg]) => { data[key] = cfg.seed ? cfg.seed() : []; });
  return data;
}

export function AppProvider({ children }){
  const [user, setUser] = useState(null); // {name, role}
  const [view, setView] = useState('dashboard');

  const [equipos, setEquipos] = useState(() => seedEquipos());
  const [ordenes, setOrdenes] = useState(() => seedOrdenes(equipos));

  // Generic state for the 12 extra modules (cuasifallas, eventos adversos, etc.)
  const [moduleData, setModuleData] = useState(() => initialModuleData());

  const [modal, setModal] = useState(null); // {type, props}
  const openModal = useCallback((type, props={}) => setModal({type, props}), []);
  const closeModal = useCallback(() => setModal(null), []);

  const login = useCallback((name, role) => setUser({name, role}), []);
  const logout = useCallback(() => { setUser(null); setView('dashboard'); }, []);

  const addEquipo = useCallback((data) => {
    setEquipos(prev => [...prev, { id: uid('EQ'), historial: [], ...data }]);
  }, []);
  const updateEquipo = useCallback((id, data) => {
    setEquipos(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  }, []);
  const deleteEquipo = useCallback((id) => {
    setEquipos(prev => prev.filter(e => e.id !== id));
  }, []);

  const addOrden = useCallback((data) => {
    setOrdenes(prev => [...prev, { id: uid('OT'), ...data }]);
  }, []);
  const updateOrden = useCallback((id, data) => {
    setOrdenes(prev => prev.map(o => o.id === id ? { ...o, ...data } : o));
  }, []);
  const deleteOrden = useCallback((id) => {
    setOrdenes(prev => prev.filter(o => o.id !== id));
  }, []);

  // Generic CRUD shared by all 12 extra modules, keyed by module key
  // (e.g. moduleKey = "cuasifallas", "refacciones", "planesMantenimiento"...)
  const addModuleItem = useCallback((moduleKey, data) => {
    setModuleData(prev => ({ ...prev, [moduleKey]: [...prev[moduleKey], { id: uid('M'), ...data }] }));
  }, []);
  const updateModuleItem = useCallback((moduleKey, id, data) => {
    setModuleData(prev => ({ ...prev, [moduleKey]: prev[moduleKey].map(item => item.id === id ? { ...item, ...data } : item) }));
  }, []);
  const deleteModuleItem = useCallback((moduleKey, id) => {
    setModuleData(prev => ({ ...prev, [moduleKey]: prev[moduleKey].filter(item => item.id !== id) }));
  }, []);

  const value = {
    user, login, logout,
    view, setView,
    equipos, addEquipo, updateEquipo, deleteEquipo,
    ordenes, addOrden, updateOrden, deleteOrden,
    moduleData, addModuleItem, updateModuleItem, deleteModuleItem,
    modal, openModal, closeModal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(){
  const ctx = useContext(AppContext);
  if(!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return ctx;
}
